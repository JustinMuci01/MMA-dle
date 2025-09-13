import sqlite3

def buildDatabase():
    
    conn = sqlite3.connect("ufc_database.db")
    dbcursor = conn.dbcursor()

    sql = """CREATE TABLE Fighters(
       Name VARCHAR(30) PRIMARY KEY,
       Country VARCHAR(30),
       Wins INT,
       Losses INT,
       Draws INT,
       Ranking INT,
       WeightClass VARCHAR(3),
       URL VARCHAR(300),
    );"""

    dbcursor.execute(sql)
    conn.commit()

    file_path = 'info.txt'

    lineQuery = """INSERT INTO Fighters (Ranking, Name, Country, Wins, Losses, Draws, WeightClass, URL)
    VALUES (? ? ? ? ? ? ? ?)"""
    try:
        with open(file_path, 'r') as file:
                lines = file.readlines()
                for line in lines:
                    print(line.strip())
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")


def deleteTable():
    conn = sqlite3.connect("ufc_database.db")
    dbcursor = conn.dbcursor()

    sql = """DROP table Fighters"""

    dbcursor.execute(sql)
