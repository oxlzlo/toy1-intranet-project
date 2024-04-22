import Button from "../components/Button";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { ref, set, get, child } from "firebase/database";
import { FirebaseError } from "firebase/app";
import logoFastCampusColumn from "../assets/images/logo_fastcampus_column.svg";

function JoinPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await set(ref(db, `users/${user.uid}`), {
          email: user.email,
          userName: user.displayName,
          phone: user.phoneNumber,
        });
      }
    });

    return () => unsubscribe();
  }, [userName, phone]);

  const duplicateEmail = async (email) => {
    try {
      const snapshot = await get(child(ref(db), "users"));
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userArray = Object.values(users);
        return userArray.some((user) => user.email === email);
      } else {
        return false;
      }
    } catch (error) {
      console.error("중복 이메일 확인 중 오류 발생:", error);
      return true;
    }
  };

  const validateEmail = async (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else if (await duplicateEmail(value)) {
      setEmailError("이미 사용된 이메일(아이디)입니다.");
    } else {
      setEmailError("");
    }
  };

  const validateUserName = (value) => {
    if (value.length > 10) {
      setUserNameError("이름은 10자 이내여야합니다.");
    } else {
      setUserNameError("");
    }
  };

  const validatePassword = (value) => {
    if (value.length < 6 || value.length > 10) {
      setPasswordError("비밀번호는 6자 이상 10자 이하여야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  const validatePasswordCheck = (value) => {
    if (value !== password) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordCheckError("");
    }
  };

  const validatePhone = (value) => {
    if (value.length !== 11) {
      setPhoneError("전화번호는 11자여야 합니다.");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "" || userName === "" || phone === "") {
      return;
    }
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(credentials.user, {
        displayName: userName,
      });
      await set(ref(db, `users/${credentials.user.uid}`), {
        email: email,
        userName: userName,
        phone: phone,
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/main");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      validateEmail(value);
    } else if (name === "password") {
      setPassword(value);
      validatePassword(value);
    } else if (name === "userName") {
      setUserName(value);
      validateUserName(value);
    } else if (name === "phone") {
      setPhone(value);
      validatePhone(value);
    }
  };

  const handlePasswordCheckChange = (e) => {
    setPasswordCheck(e.target.value);
    validatePasswordCheck(e.target.value);
  };

  return (
    <div>
      <div className="join">
        <header className="join__header">
          <h1 className="logo">
            <Link className="img-wrap" to="/login">
              <img src={logoFastCampusColumn} alt="fastcampus" />
            </Link>
          </h1>
          <h2 className="title">수강생용 인트라넷 회원가입</h2>
        </header>
        <form className="form" onSubmit={handleSubmit}>
          <div
            className={`field ${emailError ? "error" : email === "" ? "" : "success"}`}
          >
            <label htmlFor="email" className="label">
              이메일(아이디)
            </label>
            <div className="input-wrap">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="fastcampus@email.com"
                className="input"
                required
                value={email}
                onChange={handleChange}
              />
            </div>
            {emailError && <p className="error-message">{emailError}</p>}
            {!emailError && email !== "" && (
              <p className="success-message">
                사용 가능한 이메일(아이디)입니다.
              </p>
            )}
          </div>
          <div
            className={`field ${passwordError ? "error" : password === "" ? "" : "success"}`}
          >
            <label htmlFor="password" className="label">
              비밀번호
            </label>
            <div className="input-wrap">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="6자 이상 10자 이하"
                className="input"
                minLength="6"
                maxLength="10"
                required
                value={password}
                onChange={handleChange}
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            {!passwordError && password !== "" && (
              <p className="success-message">사용 가능한 비밀번호입니다.</p>
            )}
          </div>

          <div
            className={`field ${passwordCheckError ? "error" : passwordCheck === "" ? "" : "success"}`}
          >
            <label htmlFor="passwordCheck" className="label">
              비밀번호 확인
            </label>
            <div className="input-wrap">
              <input
                type="password"
                name="passwordCheck"
                id="passwordCheck"
                placeholder="6자 이상 10자 이하"
                className="input"
                minLength="6"
                maxLength="10"
                required
                value={passwordCheck}
                onChange={handlePasswordCheckChange}
              />
            </div>
            {passwordCheckError && (
              <p className="error-message">{passwordCheckError}</p>
            )}
            {!passwordCheckError && passwordCheck !== "" && (
              <p className="success-message">비밀번호가 일치합니다.</p>
            )}
          </div>
          <div
            className={`field ${userNameError ? "error" : userName === "" ? "" : "success"}`}
          >
            <label htmlFor="userName" className="label">
              이름
            </label>
            <div className="input-wrap">
              <input
                type="text"
                name="userName"
                id="userName"
                placeholder="이름을 입력하세요"
                className="input"
                required
                maxLength="20"
                value={userName}
                onChange={handleChange}
              />
            </div>
            {userNameError && <p className="error-message">{userNameError}</p>}
            {!userNameError && userName !== "" && (
              <p className="success-message">사용 가능한 이름입니다.</p>
            )}
          </div>
          <div
            className={`field ${phoneError ? "error" : phone === "" ? "" : "success"}`}
          >
            <label htmlFor="phone" className="label">
              전화번호
            </label>
            <div className="input-wrap">
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="010부터 숫자만 입력하세요(&lsquo;-&rsquo;제외)"
                className="input"
                required
                maxLength="11"
                value={phone}
                onChange={handleChange}
              />
            </div>
            {phoneError && <p className="error-message">{phoneError}</p>}
            {!phoneError && phone !== "" && (
              <p className="success-message">사용 가능한 전화번호입니다.</p>
            )}
          </div>
          <Button type="submit" size="entire" onClick={handleSubmit}>
            완료
          </Button>
        </form>
      </div>
    </div>
  );
}

export default JoinPage;
