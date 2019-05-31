import requests



url = 'http://www.heanny.cn/js/uediter/third-party/zeroclipboard/ZeroClipboard.js'



data = requests.get(url)
f = open('/Users/linlimeng/Desktop/个人博客/gg/js/uediter/third-party/zeroclipboard/ZeroClipboard.js','wb')
f.write(data.content)
print(data.content)