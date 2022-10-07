import csv
import os
import psycopg2
from psycopg2.extras import execute_values

CHUNK_SIZE = 100
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
DB_USER = os.environ["DB_USER"]
DB_NAME = DB_USER
DB_HOST = os.environ["DB_HOST"]

def _import(sql, chunk_generator):
    connection = psycopg2.connect(f"dbname={DB_NAME} user={DB_USER} host={DB_HOST}")
    cursor = connection.cursor()

    for chunk in chunk_generator():
        execute_values(
            cursor,
            sql,
            chunk,
            page_size=CHUNK_SIZE,
        )
        connection.commit()

    cursor.close()
    connection.close()

def _gen_chunk(filename, clean_func):
    abs_filename = os.path.join(DATA_DIR, filename)
    chunk = []
    with open(abs_filename, "r") as csvfile:
        reader = csv.reader(csvfile)
        next(reader) # ignore header
        current_size = 0
        for row in reader:
            if current_size == CHUNK_SIZE:
                yield chunk
                current_size, chunk = 0, []

            # clean data
            clean_func(row)

            current_size += 1
            chunk.append(row)

        if current_size > 0:
            yield chunk

def _gen_people_chunk():
    def clean_data(row):
        for i, item in enumerate(row):
            row[i] = row[i].strip()
            if item in ["", "n/a", ".", "-", "---"]:
                row[i] = None

    return _gen_chunk("people.csv", clean_data)

def import_people():
    _import(
        "INSERT INTO people(person_id, company_name, company_li_name, last_title, group_start_date, group_end_date) VALUES %s",
        _gen_people_chunk
    )
    print("people imported successfully")

def _gen_companies_chunk():
    def clean_data(row):
        for i, item in enumerate(row):
            row[i] = row[i].strip()
            if item in ["", "n/a", ".", "-", "---"]:
                row[i] = None

            if i == 1 or i == 7:  # linkedin names or investors
                if row[i] is None:
                    row[i] = "{}"
                else:
                    names = row[i].lstrip("[").rstrip("]").strip().split(",")
                    double_quotes = '"'
                    names = map(lambda name: f'"{name.strip().strip(double_quotes).strip()}"', names)
                    names = ",".join(names)
                    row[i] = f"{{{names}}}"

    return _gen_chunk("companies.csv", clean_data)

def import_companies():
    _import(
        "INSERT INTO companies(name, linkedin_names, description, headcount, founding_date, most_recent_raise, most_recent_valuation, investors, known_total_funding) VALUES %s",
        _gen_companies_chunk
    )
    print("companies imported successfully")

import_people()
import_companies()
