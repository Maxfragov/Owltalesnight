# Публикация карусели (2–10 картинок) в Instagram через Graph API.
# python3 instagram_carousel.py <podpis.txt> <url1.jpg> <url2.jpg> ... [--comment kommentariy.txt] [--dry-run]
# Картинки API берёт только по публичным ссылкам (JPEG): кладём их в репозиторий и даём raw.githubusercontent.com.
# Переменные окружения: IG_USER_ID, IG_ACCESS_TOKEN (как в instagram_publish.py).
# ВАЖНО: публикация — необратимое внешнее действие. Запускать только после «ок» Владислава.
import os, sys, time, json, argparse, urllib.request, urllib.parse
V='v21.0';G=f'https://graph.facebook.com/{V}'
ap=argparse.ArgumentParser();ap.add_argument('caption');ap.add_argument('urls',nargs='+');ap.add_argument('--comment');ap.add_argument('--dry-run',action='store_true')
a=ap.parse_args()
uid=os.environ.get('IG_USER_ID');tok=os.environ.get('IG_ACCESS_TOKEN')
cap=open(a.caption,encoding='utf-8').read().strip();com=open(a.comment,encoding='utf-8').read().strip() if a.comment else None
print(f'слайдов {len(a.urls)}; подпись {len(cap)} символов, хэштегов {cap.count("#")}')
assert 2<=len(a.urls)<=10,'в карусели 2–10 картинок'
assert cap.count('#')<=5,'больше 5 хэштегов';assert len(cap)<=2200
for u in a.urls:
    with urllib.request.urlopen(urllib.request.Request(u,method='HEAD'),timeout=60) as f:assert f.status==200,u
if a.dry_run or not (uid and tok):print('dry-run: ничего не отправлено');sys.exit(0)
def call(method,url,data=None):
    body=urllib.parse.urlencode(data).encode() if data else None
    try:
        with urllib.request.urlopen(urllib.request.Request(url,data=body,method=method),timeout=300) as f:return json.loads(f.read())
    except urllib.error.HTTPError as e:sys.exit('ошибка API: '+e.read().decode()[:500])
def wait(cid):
    for i in range(30):
        st=call('GET',f'{G}/{cid}?fields=status_code&access_token={tok}').get('status_code')
        if st=='FINISHED':return
        if st=='ERROR':sys.exit(f'ошибка обработки {cid}')
        time.sleep(5)
    sys.exit(f'не обработано {cid}')
kids=[]
for u in a.urls:
    c=call('POST',f'{G}/{uid}/media',{'image_url':u,'is_carousel_item':'true','access_token':tok});kids.append(c['id']);print('слайд',c['id'])
for k in kids:wait(k)
c=call('POST',f'{G}/{uid}/media',{'media_type':'CAROUSEL','children':','.join(kids),'caption':cap,'access_token':tok});cid=c['id'];print('карусель',cid)
wait(cid)
m=call('POST',f'{G}/{uid}/media_publish',{'creation_id':cid,'access_token':tok});mid=m['id'];print('опубликовано',mid)
if com:print('первый комментарий',call('POST',f'{G}/{mid}/comments',{'message':com,'access_token':tok}).get('id'))
print(call('GET',f'{G}/{mid}?fields=permalink&access_token={tok}').get('permalink'))
