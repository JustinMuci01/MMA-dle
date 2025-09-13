import sqlite3
import builddb
#Build SQL database

builddb.buildDatabase()

#Build Objects
class Fighter:
    def __init__(self, name, ranking, wins, losses, draws, weightClass, country):
        self.name = name
        self.ranking = ranking
        self.wins = wins
        self.losses = losses
        self.draws = draws
        self.country = country
        self.weightClass = weightClass
    

conn = sqlite3.connect("ufc_database.db")

dbcursor = conn.dbcursor()

sql = "SELECT * FROM Fighters"

dbcursor.execute(sql)

result = dbcursor.fetchAll()

print(result)
