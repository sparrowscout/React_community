import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components"

//게시글 생성
import { useDispatch, useSelector } from "react-redux";
import { addPostFB, updatePostFB, loadPostFB } from "./redux/modules/Post";

import moment from "moment";

import { auth, db, storage } from "./shared/firebase";
import { getDocs, where, query, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";

const Edit = () => {
    const my_post = useSelector((state) => state.post.list);
    const params = useParams();
    const post_index = params.index
    
    const [previewImg, setPreviewImg] = useState(my_post[post_index].img_url);

    const history = useHistory();
    const dispatch = useDispatch();
    const nowTime = moment().format('YYYY/MM/DD HH:mm');

    //게시글 레이아웃 라디오 버튼
    const [layout, setLayout] = useState("right");

    const content = React.useRef();
    const img_url = React.useRef();

    //다운로드 url firestore에 업로드하기
    const file_link_ref = React.useRef(null);

    React.useEffect(() => {
        dispatch(loadPostFB())
    }, []);

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


    const updatePost = () => {
        dispatch(updatePostFB({
            img_url: file_link_ref.current.url,
            content: content.current.value,
            layout: layout.theme
        },my_post[post_index].id))
        history.push("/")
    }

    return (
        <Container>

            <BackButton onClick={() => history.goBack()}>← 뒤로가기</BackButton><br />

            <h1>수정페이지 입니다.</h1>
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
                <textarea ref={content}>{my_post[post_index].content}</textarea>
            </div>
            <button onClick={updatePost}>수정하기</button>
        </Container>
    )
}

const Container = styled.div`
text-align: left;
margin: auto;
width: 80vw;
`;

const BackButton = styled.button`
    position: fixed;
    left: 0;
    margin: 15px;
`;

const ImgPreview = styled.img`
background-color: #eee;
width: 300px;
margin: ${(props) => props.layout};
display: block;
`;

export default Edit;