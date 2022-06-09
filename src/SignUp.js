import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"

//이미지 업로드하기
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./shared/firebase"


const SignUp = () => {
    const mail_ref = React.useRef(null);
    const nickname_ref = React.useRef(null);
    const pw_ref = React.useRef(null);
    const pw_check_ref = React.useRef(null);

    //다운로드 url firestore에 업로드하기
    const file_link_ref = React.useRef(null);

    //스토리지에 이미지 저장하기
    const uploadFB = async (e) => {
        console.log(e.target.files); //FileList 객체 나옴
        const uploaded_file = await uploadBytes(
            ref(storage, `images/${e.target.files[0].name}`),
            e.target.files[0]
        );

    //업로드 됐는지 확인, meta data 랑 ref 가져옴 (ref로 다운로드 url 가져올 수 있음)
    console.log(uploaded_file)

    const file_url = await getDownloadURL(uploaded_file.ref);
    console.log(file_url);

    file_link_ref.current = {url: file_url};
    }

    const history = useHistory();

    const signUpFB = async () => {

        // //값 멀쩡한거 확인하기 (벨리데이션)
        // if (mail_ref.current.value === "") {
        //     return false
        // }

        const user = await createUserWithEmailAndPassword(auth, mail_ref.current.value, pw_ref.current.value)
        console.log(user)

        const user_doc = await addDoc(collection(db, "users"), {
            user_email: user.user.email,
            nickname: nickname_ref.current.value,
            image_url:file_link_ref.current.url
        });
        console.log(user_doc.id)
        history.push("/");
    };
    return (
        <div>
            <BackButton onClick={() => history.goBack()}>← 뒤로가기</BackButton> <h1>회원가입페이지 입니다.</h1>
            <SignUpContainer>
                이메일 <br />
                <input ref={mail_ref} required/><br />
                닉네임 <br />
                <input ref={nickname_ref} /><br />
                비밀번호 <br />
                <input ref={pw_ref} type="password" /><br />
                비밀번호 확인 <br />
                <input ref={pw_check_ref} type="password" /><br />
                사진선택 <br />
                <input type="file" onChange={uploadFB} /><br />

                <button onClick={signUpFB}>회원가입하기</button>
            </SignUpContainer>
        </div>


    )
}


const BackButton = styled.button`
    position: fixed;
    left: 0;
    margin: 15px;
`;



const SignUpContainer = styled.div`
text-align: left;
margin: auto;
width: 80vw;
`;


export default SignUp;