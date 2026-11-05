# Публикация Reels в Instagram через официальный Graph API (resumable upload, без публичной ссылки на видео).
# python3 instagram_publish.py <video.mp4> <podpis.txt> [--comment kommentariy.txt] [--thumb-ms 0] [--cover-url https://...jpg] [--dry-run]
# Переменные окружения (задаются в настройках облачного окружения, не в чате):
#   IG_USER_ID       — id Instagram-аккаунта (instagram_business_account)
#   IG_ACCESS_TOKEN  — токен с правами instagram_basic, instagram_content_publish, instagram_manage_comments
# Сеть: должны быть разрешены graph.facebook.com и rupload.facebook.com.
# ВАЖНО: публикация — необратимое внешнее действие. Запускать только после «ок» Владислава на конкретный выпуск.
import os, sys, time, json, argparse, urllib.request, urllib.parse, urllib.error
V='v21.0'
ap=argparse.ArgumentParser();ap.add_argument('video');ap.add_argument('caption');ap.add_argument('--comment');ap.add_argument('--thumb-ms',type=int,default=None);ap.add_argument('--cover-url');ap.add_argument('--dry-run',action='store_true')
a=ap.parse_args()
uid=os.environ.get('IG_USER_ID');tok=os.environ.get('IG_ACCESS_TOKEN')
cap=open(a.caption,encoding='utf-8').read().strip();com=open(a.comment,encoding='utf-8').read().strip() if a.comment else None
size=os.path.getsize(a.video)
print(f'видео {a.video} {size/1e6:.1f} МБ; подпись {len(cap)} символов, хэштегов {cap.count("#")}')
assert cap.count('#')<=5,'больше 5 хэштегов'
assert len(cap)<=2200,'подпись длиннее 2200 символов'
if a.dry_run or not (uid and tok):
    print('dry-run: ничего не отправлено' if a.dry_run else 'нет IG_USER_ID / IG_ACCESS_TOKEN — ничего не отправлено');sys.exit(0)
def call(method,url,data=None,headers=None,body=None):
    if data is not None:body=urllib.parse.urlencode(data).encode()
    r=urllib.request.Request(url,data=body,method=method,headers=headers or {})
    with urllib.request.urlopen(r,timeout=300) as f:return json.loads(f.read())
G=f'https://graph.facebook.com/{V}'
p={'media_type':'REELS','upload_type':'resumable','caption':cap,'share_to_feed':'true','access_token':tok}
if a.thumb_ms is not None:p['thumb_offset']=str(a.thumb_ms)
if a.cover_url:p['cover_url']=a.cover_url
c=call('POST',f'{G}/{uid}/media',p);cid=c['id'];print('контейнер',cid)
# Загрузку делаем через curl: из urllib большие файлы через прокси не доходят. Instagram часто отвечает 400, хотя файл принят, поэтому смотрим статус контейнера ниже.
import subprocess
r=subprocess.run(['curl','-sS','-m','600','-X','POST',c.get('uri') or f'https://rupload.facebook.com/ig-api-upload/{V}/{cid}','-H',f'Authorization: OAuth {tok}','-H','offset: 0','-H',f'file_size: {size}','--data-binary','@'+a.video],capture_output=True,text=True)
print('загрузка',r.stdout[:300].replace(tok,'***'),r.stderr[:300].replace(tok,'***'))
for i in range(60):
    st=call('GET',f'{G}/{cid}?fields=status_code,status&access_token={tok}');print('статус',st.get('status_code'))
    if st.get('status_code')=='FINISHED':break
    if st.get('status_code')=='ERROR':sys.exit('ошибка обработки: '+json.dumps(st,ensure_ascii=False))
    time.sleep(10)
if st.get('status_code')!='FINISHED':sys.exit('видео не обработано, публикация отменена')
m=call('POST',f'{G}/{uid}/media_publish',{'creation_id':cid,'access_token':tok});mid=m['id'];print('опубликовано',mid)
if com:print('первый комментарий',call('POST',f'{G}/{mid}/comments',{'message':com,'access_token':tok}))
print(call('GET',f'{G}/{mid}?fields=permalink&access_token={tok}').get('permalink'))
