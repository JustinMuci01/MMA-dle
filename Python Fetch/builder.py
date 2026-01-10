import os
from bs4 import BeautifulSoup
import mysql.connector
import requests
from data import mydb


mycursor = mydb.cursor()

#DATABASE FUNCTIONS SHOW, CREATE, CREATE TABLE
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

def showTable():
    sql = 'SELECT * FROM Fighters WHERE '
    mycursor.execute(sql)
    result = mycursor.fetchall()

    with open('test.txt', 'w', encoding = 'utf-8') as file:
        for r in result:
            if int(r[1]) == None or int(r[1])==0:
                rank = 'C'
            else:
                rank = f"#{r[1]}"
            print(
                f"{rank} ({r[5]}) {r[0]}: "
                f"{r[2]}-{r[3]}-{r[4]} From {r[6]}"
            )
            file.write(
                f"{rank} ({r[5]}) {r[0]}: "
                f"{r[2]}-{r[3]}-{r[4]} From {r[6]}\n"
            )

#PARSE THROUGH HTML DOC FOR ATHLETE LINKS
def findTags(tag):
    return tag.name == "a" and tag.get("href", "").startswith("/athlete")

#FROM ATHLETE LINKS AND WEIGHTCLASS, EXTRACT WINS, LOSSES, DRAWS, COUNTRY, and PICURL
#THEN ADDS INTO SQL TABLE 'Fighters'
def extractPlayer(player, WC, ranking):

    name = player.text
    print(name)
    print(WC, end=" ")
    print(ranking)

    playerLink = player['href']
    fighterPage = requests.get("https://www.ufc.com" + playerLink)
    if fighterPage.status_code != 200:
        return
    newSoup = BeautifulSoup(fighterPage.text, 'html.parser')


    target = newSoup.find('p',class_='hero-profile__division-body')
    strList = target.text.split('-')
    wins = int(strList[0])
    losses=int(strList[1])
    draws = int(strList[2][0])

    print("W:", end=" ")
    print(wins)
    
    print("L:", end=" ")
    print(losses)
          
    print("D:", end=" ")
    print(draws)
    origin = newSoup.find_all('div', class_='c-bio__text')

    originList = origin[1].text.split(',')

    if len(originList) == 2:
        country = originList[1][1:]
    else:
        country = originList[0]

    print(country)

    imgTarget = newSoup.find('div', class_="hero-profile__image-wrap")
    imgTag = imgTarget.contents[1]['src']
    print(imgTag)

    sql="""INSERT IGNORE INTO Fighters (Name, Ranking, Wins, Losses, Draws, WeightClass, Country, Pic)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                     """
    
    mycursor.execute(sql, (name, ranking, wins, losses, draws, WC, country, imgTag))
    mydb.commit()

def buildDB():
    DIVISIONS = ["Flw", "BW", "FW", "LW", "WW", "MW", "LHW", "HW", "SW", "Flw", "BW"]
    url = "https://www.ufc.com/rankings"

    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')

    main = soup.find('main')
    string_list = main.find_all(findTags)   #LIST OF 176 RANKED FIGHTERS

    del string_list[:16] #Delete P4P list
    idx=0
    string_list = string_list[:128] + string_list[144:] #Delete Women's P4P

    for currClass in DIVISIONS: #FOR EACH ENTRY EXTRACT DATA FROM PERSONAL PAGE IN extractPlayer() and build sql database
        print(currClass)
        for j in range(16):

            # extractPlayer(string_list[idx]['href'])
            extractPlayer(string_list[idx], currClass, j)
            idx+=1
        

showTable()
mycursor.close()
mydb.close()