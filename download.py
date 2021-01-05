#!/usr/local/bin/python3

import os, sys, time
from bs4 import BeautifulSoup
import re
import sqlite3

import urllib.request
from urllib.parse import quote
import shutil

import requests
import random
import base64
import multiprocessing
from multiprocessing import Pool

db = sqlite3.connect('directory.db3', isolation_level=None)

session = requests.Session()

session.trust_env = False

session.headers.update({'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'})

base = "https://us-business.info/directory/"

def getState(state):
    url = base + state

    r = session.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    nav = soup.find('nav', { "class", "locations"})
    list = nav.find('ul')
    for li in list:
        href = li.find('a')["href"]
        if href.startswith("../"):
            getCity(href.replace('../', ''))
            
def getCity(city_url):
    print(city_url)
    url = base + city_url

    file = './html/' + city_url.replace('/', '') + '.html'

    html = ''
    if os.path.isfile(file):
        print("Loading %s" % file)
        with open(file, 'r') as f:
            html = f.read()
    else:
        print("Fetching %s" % url)
        r = session.get(url)
        html = r.text
        f = open(file, 'w')
        f.write(html)
        f.close()
        
    soup = BeautifulSoup(html, "html.parser")
    
    divs = soup.findAll('div', { 'class', 'vcard' })

    for div in divs:

        id = div['id']

        c = db.cursor()
        c.execute('select 1 from businesses where id = ?', (id,))
        exists = c.fetchone()

        if exists is not None:
            continue;

        print(exists)
        print(div)
        
        lat = None
        lon = None
        if div.has_attr('data-lat'):
            lat = div['data-lat']

        if div.has_attr('data-lng'):
            lon = div['data-lng']
        
        name = div.find('div', { 'class', 'fn org'}).text
        address = div.find('span', { 'class', 'street-address' }).text
        city = div.find('span', { 'class', 'locality' }).text
        state = div.find('abbr', { 'class', 'region' }).text
        zip = div.find('span', { 'class', 'postal-code' }).text

        phone = None

        p = div.find('div', { 'class', 'tel' })
        if p is not None:
            phone = p.text
            
        cats = []
        for cat in div.find('div', { 'class', 'category' }).findAll('span', { 'class', 'value' }):
            cats.append(cat.text)
        
        sql = "insert into businesses (id, url, name, address, locality, region, zip, phone, lat, lon, categories)"
        sql += " values (?,?,?,?,?,?,?,?,?,?,?)"

        data = (id, city_url, name, address, city, state, zip, phone, lat, lon, '::'.join(cats),)
        c.execute(sql, data)
            
    a = soup.findAll('a', { 'class', 'button' })
    
    if a is not None:
        for n in a:
            if n.text == 'Next':
                href = n["href"]
                url = href.replace('/directory/', '')
                getCity(url)

getState('MA')
