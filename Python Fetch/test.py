from bs4 import BeautifulSoup
import  mysql.connector
import requests


mydb = mysql.connector.connect(
    host = "localhost",
    user="JMuci14",
    password="Qwepoi_20128059",
    database = "mmafighters"
)

mycursor = mydb.cursor()

def showDataBases():
    mycursor.execute("SHOW DATABASES")
    for x in mycursor:
        print(x)
    return


def createBase():
    mycursor.execute("CREATE DATABASE IF NOT EXISTS MMAFighters")

def createTable():
    mycursor.execute("""CREATE TABLE IF NOT EXISTS Fighters ( 
                    Name VARCHAR(255) PRIMARY KEY,
                    Ranking INT,
                    Wins INT,
                    Losses INT,
                    Draws INT,
                    WeightClass VARCHAR(10),
                    Country VARCHAR(255),
                    Pic VARCHAR(1000)
                     )""")


mycursor.execute("SHOW TABLES")

for x in mycursor:
    print(x)

# def scanFighter():    
#     print('hi')
#     return

# url = "https://www.ufc.com/rankings"

# page = requests.get(url)

# soup = BeautifulSoup(page.text, 'html.parser')

# soup.find('table')
# string_list = soup.find(attrs = {"class: "})
# print(string_list)

# # with open("test.html", 'w', encoding = 'utf-8') as page:
# #     page.write(html_string)