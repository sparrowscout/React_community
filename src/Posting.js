import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components"

//게시글 생성
import { useDispatch } from "react-redux";
import { addPostFB } from "./redux/modules/Post";

import moment from "moment";

import { auth, db, storage } from "./shared/firebase";
import { getDocs, where, query, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Posting = () => {

    const [previewImg, setPreviewImg] = useState("https://firebasestorage.googleapis.com/v0/b/authex-d686f.appspot.com/o/images%2Fimage_sample.png?alt=media&token=151e0c6d-1804-4ba1-9370-2f35fb56b8b5");

    const history = useHistory();
    const dispatch = useDispatch();
    const nowTime = moment().format('YYYY/MM/DD HH:mm');

    //게시글 레이아웃 라디오 버튼
    const [layout, setLayout] = useState("right");

    const content = React.useRef();
    const img_url = React.useRef();

    //다운로드 url firestore에 업로드하기
    const file_link_ref = React.useRef(null);

    //스토리지에 이미지 저장하기
    const uploadFB = async (e) => {
        console.log(e.target.files); //FileList 객체 나옴
        const uploaded_file = await uploadBytes(
            ref(storage, `images/${e.target.files[0].name}`),
            e.target.files[0]


        );

        console.log(uploaded_file)

        const file_url = await getDownloadURL(uploaded_file.ref);
        console.log(file_url);

        file_link_ref.current = { url: file_url };


        const reader = new FileReader()

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onloadend = () => {
            const previewImgUrl = reader.result

            if (previewImgUrl) {
                setPreviewImg([previewImgUrl])
            }
        }
    }


    const addPost = async () => {

        const user_docs = await getDocs(
            query(collection(db, "users"),
                where("user_email", "==", auth.currentUser.email))
        );

        //usernickname 밖으로 꺼내기
        let usernickname = "";

        user_docs.forEach(u => {
            usernickname = u.data().nickname
        })

        dispatch(addPostFB({
            img_url: file_link_ref.current.url,
            layout: layout.theme,
            user: usernickname,
            date: nowTime,
            content: content.current.value,
            completed: false,
            user_email: auth.currentUser.email
        }))

        history.push("/")
    }

    return (
        <Container>


            <h1>포스팅페이지 입니다.</h1>
            <h3>사진 선택 </h3>
            <input type="file" accept='image/*' onChange={uploadFB} />
            <h3> 레이아웃 고르기</h3>


            <div>
                <input type="radio" name="theme" value="right" 
                onChange={(e) => setLayout({ theme: e.target.value })}/>
                오른쪽에 이미지 왼쪽에 텍스트<br />

                <ImgPreview src={previewImg} layout="0px 0px 0px auto"/>   
                </div>             
                
                <div>
                <input type="radio" name="theme" value="left"
                onChange={(e) => setLayout({ theme: e.target.value })}/>
                왼쪽에 이미지 오른쪽에 텍스트<br />

                <ImgPreview src={previewImg} layout="0px auto 0px 0px"/>
               </div>
               
               <div>
                <input type="radio" name="theme" value="center"
                onChange={(e) => setLayout({ theme: e.target.value })}/>
                하단에 이미지 상단에 텍스트<br />

                <ImgPreview src={previewImg} layout="auto"/>
            </div>
            
            <div>
                <h3> 게시물 내용</h3>
                <textarea ref={content} />
            </div>
            <button onClick={addPost}>작성하기</button>
        </Container>
    )
}

const Container = styled.div`
text-align: left;
margin: auto;
width: 80vw;

textarea {
    width: 100%;
    resize: none; 
    height: 100px;
    border: 1px solid #9c27b0;
    border-radius: 10px;
}

button {
width: 100%;
background-color: #9c27b0;
color: white;
border: 1px solid #9c27b0;
padding: 10px;
border-radius: 20px;
}
`;

const ImgPreview = styled.img`
background-color: #eee;
width: 300px;
margin: ${(props) => props.layout};
display: block;
`;



export default Posting;