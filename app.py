from http import client
from flask import Flask, render_template, request, jsonify, escape
from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup

import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

DB_HOST = os.environ.get("MONGODB_URL")
DB_NAME = os.environ.get("DB_NAME")

client = MongoClient(DB_HOST)
db = client[DB_NAME]

app = Flask(__name__)

# routes home
@app.route('/')
def home():
    return render_template('index.html')

# routes spartapedia
@app.route('/spartapedia')
def spartapedia():
    return render_template('spartapedia.html')

# routes wishlist
@app.route('/wishlist')
def wishlist():
    return render_template('wishlist.html')

# routes mars
@app.route('/mars')
def mars():
    return render_template('mars.html')

# routes funbook
@app.route('/funbook')
def funbook():
    return render_template('funbook.html')

########################c#########################################
#################################################################

# spartapedia subroutes
@app.route("/movie", methods=["POST"])
def movie_post():
    url_receive = escape(request.form['url_give'])
    star_receive = escape(request.form['star_give'])
    comment_receive = escape(request.form['comment_give'])

    # Pengecekan url dari imdb.com
    if 'imdb.com' not in url_receive:
        return jsonify({'msg': "Url harus dari imdb.com"})

    if 'title' not in url_receive:
        return jsonify({'msg': "Url tidak valid"})
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    
    data = requests.get(url_receive, headers=headers)
    
    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')
    og_title = soup.select_one('meta[property="og:title"]')
    og_description = soup.select_one('meta[property="og:description"]')

    image = og_image['content']
    title = og_title['content']
    desc = og_description['content']

    doc = {
        'image':escape(image),
        'title':escape(title),
        'description':escape(desc),
        'star':escape(star_receive),
        'comment':escape(comment_receive)
    }

    db.movies.insert_one(doc)

    return jsonify({'msg': "Data berhasil di tambahkan" })

@app.route("/movie", methods=["GET"])
def movie_get():
    movie_list = list(db.movies.find({}, {'_id': False}))
    return jsonify({'movies': movie_list})

# end spartapedia

#################################################################
#################################################################

# bucket list/wishlist subroutes
@app.route("/bucket", methods=["POST"])
def bucket_post():
    bucket_receive = request.form["bucket_give"]
    count = db.bucket.count_documents({})
    num = count + 1
    doc = {
        'num': num,
        'bucket': escape(bucket_receive),
        'done': 0
    }
    db.bucket.insert_one(doc)
    return jsonify({'msg':'data saved!'})

@app.route("/bucket/done", methods=["POST"])
def bucket_done():
    num_receive = request.form["num_give"]
    db.bucket.update_one(
        {'num': int(num_receive)},
        {'$set': {'done': 1}}
    )
    return jsonify({'msg': 'Update done!'})

@app.route("/bucket", methods=["GET"])
def bucket_get():
    data = list(db.bucket.find({}, {'_id':False}))
    return jsonify({'buckets': data})

@app.route("/bucket/del", methods=["POST"])
def bucket_delete():
    num_receive = int(request.form['num_give'])
    db.bucket.delete_one({'num': num_receive})
    return jsonify({'msg': 'data berhasil di hapus'})
# end wishlist/bucketlist

#################################################################
#################################################################

# martian land subroute
@app.route("/postmars", methods=["POST"])
def web_mars_post():
    name_receive = escape(request.form['name_give'])
    address_receive = escape(request.form['address_give'])
    size_receive = escape(request.form['size_give'])

    doc = {
        'name': name_receive,
        'address': address_receive,
        'size': size_receive
    }

    db.orders.insert_one(doc)
    return jsonify({'msg': 'complete'})


@app.route("/getmars", methods=["GET"])
def mars_get():
    orders_list = list(db.orders.find({},{'_id':False}))
    return jsonify({'orders':orders_list})
# end martian land routes

#################################################################
#################################################################

# funbook subroute
@app.route("/homework", methods=["POST"])
def homework_post():
    name_give = request.form["name_give"]
    commen_give = request.form["comment_give"]
    
    doc = {
        'name': escape(name_give),
        'comment': escape(commen_give)
    }
    
    db.fanmessages.insert_one(doc)
    return jsonify({'msg': 'data berhasil ditambahkan'})
    
# route untuk mengambil data
@app.route("/homework", methods=["GET"])
def homework_get():
    message_list = list(db.fanmessages.find({}, {'_id': False}))
    return jsonify({'message': message_list})

@app.route('/delete_all', methods=['GET'])
def delete_all():
    db.fanmessages.delete_many({})
    return jsonify({'msg': 'Semua data dihapus!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)