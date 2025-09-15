import sqlite3

def buildDatabase():
    
    conn = sqlite3.connect("ufc_database.db")
    dbcursor = conn.cursor()

    sql = """CREATE TABLE IF NOT EXISTS Fighters(
       Name VARCHAR(30) PRIMARY KEY,
       Country VARCHAR(30),
       Wins INT,
       Losses INT,
       Draws INT,
       Ranking INT,
       WeightClass VARCHAR(3),
       URL VARCHAR(300)
    );"""

    dbcursor.execute(sql)
    conn.commit()

    file_path = 'info.txt'

    lineQuery = """INSERT INTO Fighters (Ranking, Name, Wins, Country, Losses, Draws, WeightClass, URL)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)"""
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()
            
            for line in lines:
                parts = line.strip().split()

                nameString = parts[1]
                for i in range(2,5):
                    if (parts[i].isnumeric()):
                        winNumb = i
                        break
                    else:  
                        nameString += f" {parts[i]}"
                
                countryString = parts[winNumb+1]
                for i in range(winNumb+2, len(parts)):
                    if (parts[i].isnumeric()):
                        lossNumb = i
                        break
                    else:  
                        countryString += f" {parts[i]}"
                    
                dbcursor.execute(lineQuery, (parts[0], nameString, parts[winNumb], countryString, parts[lossNumb], 
                parts[lossNumb+1], parts[lossNumb+2], parts[lossNumb+3]))

            conn.commit()
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")


def deleteTable():
    conn = sqlite3.connect("ufc_database.db")
    dbcursor = conn.cursor()

    sql = """DROP table Fighters"""

    dbcursor.execute(sql)

def showTable():
    conn = sqlite3.connect("ufc_database.db")
    dbcursor = conn.cursor()

    sql = """SELECT * FROM Fighters"""

    dbcursor.execute(sql)
    result = dbcursor.fetchall()
    for row in result:
        print(f"#{row[5]}. {row[0]} ({row[6]}) {row[1]} - {row[2]} {row[3]} {row[4]}")