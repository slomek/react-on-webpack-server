npm run build
rm -rf prod
mkdir prod
cp -r dist/* prod
echo "window.API_URL = '${API_URL}';" > $(ls prod/js/config*)
http-server -c-1 prod/
