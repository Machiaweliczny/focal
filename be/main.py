from flask import Flask, request, make_response, Response, redirect, url_for
import random
import string
app = Flask(__name__) # Should be added to requirements.txt, for now use "pip3 install Flask"

users = [
    { "email": "email1@example.com", "password_hash": "123", "otp": False },
    { "email": "email2@example.com", "password_hash": "123", "otp": True, "otp_value": '111111' }
]

def hash_password(pw):
    # Should use bcrypt normally
    return "123"

def find_user(email, pw):
    matching = filter(lambda u: u["email"] == email and u["password_hash"] == hash_password(pw), users)
    try:
        return next(matching)
    except StopIteration:
        return None

def find_user_by_session_id(session_id):
    try:
        matching = filter(lambda u: u["session_id"] == session_id, users)
        return next(matching)
    except:
        return None

SESSION_COOKIE = "session_id"
USER_COOKIE = "user"

def current_user(request):
    session_id = request.cookies.get(SESSION_COOKIE)
    user = find_user_by_session_id(session_id)
    return user

def generate_session_id(): # also should be something better
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=128))

def handle_otp(user, otp):
    if not user["otp"]:
        return None

    if not otp: 
        return Response('{"error":"otpRequired"}', status=401, mimetype='application/json') 

    if otp != user["otp_value"]:
        return Response('{"error": "otpInvalid"}', status=401, mimetype='application/json')


@app.route('/logout', methods=["POST"])
def logout():
    user = current_user(request)
    if user:
        del user["session_id"]

    res = make_response(redirect('http://localhost:3000/'))
    res.delete_cookie(SESSION_COOKIE)
    res.delete_cookie(USER_COOKIE)
    return res


@app.route('/login', methods=["POST"])
def login():
    form = request.get_json();
    email = form['email']
    pw = form['password']
    otp = form['otp']

    user = find_user(email, pw)

    if not user:
        return Response('{"error": "invalidCredentials"}', status=401, mimetype='application/json')
    
    otp_res = handle_otp(user, otp)
    if otp_res:
        return otp_res

    user["session_id"] = generate_session_id()
    res = Response('{"success": true }', status=200, mimetype='application/json')
    res.set_cookie(SESSION_COOKIE, user["session_id"], httponly=True, samesite="strict")
    res.set_cookie(USER_COOKIE, user["email"])
    return res

# @app.route('/*', methods=["GET"])
# def send_static(path):
#     # Should be defined as middleware
#     # if current_user(request):
#     return send_from_directory('../front/front/dist', 'index.html')

if __name__ == '__main__':
    app.run(host='localhost', port=3001)
    

    