import sqlite3
import json
import os
import sys
script_path = os.path.abspath(__file__)
script_directory = os.path.dirname(script_path)

# Add that directory to sys.path
if script_directory not in sys.path:
    sys.path.insert(0, script_directory)

import builddb
#Build SQL database

builddb.deleteTable()
builddb.buildDatabase()

#Build Objects
class Fighter:
    def __init__(self, name, ranking, wins, losses, draws, weightClass, country, picURL):
        self.name = name
        self.ranking = ranking
        self.wins = wins
        self.losses = losses
        self.draws = draws
        self.country = country
        self.weightClass = weightClass
        self.picURL = picURL
    
def makeJsonString(fighter):
    fighter_dict = {
        "name": fighter.name,
        "ranking": fighter.ranking,
        "wins": fighter.wins,
        "losses": fighter.losses,
        "draws": fighter.draws,
        "weightClass": fighter.weightClass,
        "country": fighter.country,
        "picURL": fighter.picURL,
    }
    return fighter_dict
    
    
myArray = []
conn = sqlite3.connect(f"{script_directory}/datafiles/ufc_database.db")
dbcursor = conn.cursor()
sql = "SELECT * FROM Fighters"
dbcursor.execute(sql)
result = dbcursor.fetchall()

for row in result:
    newFighter = Fighter(row[0], row[5], row[2], row[3], row[4], row[6], row[1], row[7])
    myArray.append(newFighter) 

jsonFighterList = []
for fighter in myArray:
    jsonFighterList.append(makeJsonString(fighter))

json_string = json.dumps(jsonFighterList, indent=4)
print(json_string)

with open(f"{script_directory}/../src/fighters.js", "w") as f:
    f.write(f"const FighterList = {json_string}")
