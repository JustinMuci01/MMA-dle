from bs4 import BeautifulSoup
import requests

url = "https://www.ufc.com/rankings"

page = requests.get(url)

soup = BeautifulSoup(page.text, 'html.parser')

soup.find('table')
string_list = soup.find_all('h5')
for i in range(13):
    print(string_list[i].text)

# with open("test.html", 'w', encoding = 'utf-8') as page:
#     page.write(html_string)