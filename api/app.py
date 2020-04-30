import plaid
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

app = Flask(__name__)

client = plaid.Client(*******,
                      *******,
		      *******,
                      'sandbox')

@app.route("/get_access_token", methods=['POST'])
def get_access_token():
    public_token = request.json['public_token']
    exchange_response = \
        client.Item.public_token.exchange(public_token)

    return jsonify(exchange_response)

@app.route('/accounts/balance/get', methods=['POST'])
def get_balance():
    access_token = request.json['access_token']
    accounts = client.Accounts.balance.get(access_token)['accounts']
    return jsonify(accounts)

@app.route('/transactions', methods=['POST'])
def transactions():
    access_token = request.json['access_token']
    transactions = client.Transactions.get(access_token,
                                   start_date='2020-04-01',
                                   end_date='2020-04-30')['transactions']
    return jsonify(transactions)

if __name__ == "__main__":
    app.run(port=7000)
