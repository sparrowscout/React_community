import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removePostFB } from "./redux/modules/Post";
import { useHistory } from "react-router-dom";
import { auth } from "./shared/firebase";
import styled from "styled-components"

const Detail = () => {

    
    const history = useHistory();
    const params = useParams();
    const post_list = useSelector((state) => state.post.list)
    const post_index = params.index

    const dispatch = useDispatch();

    const deletePost = () => {
        dispatch(removePostFB(post_list[post_index].id));
        history.goBack()
    }

    const [is_mine, setIsmine] = React.useState(false);

    const myPostCheck = async (user) => {
        if (post_list[post_index].user_email === auth.currentUser.email) {
            setIsmine(true);
        } else {
            setIsmine(false);
        }
    }

    React.useEffect(() => {
        myPostCheck();
    })

    return (
        <Container>
            <div>
                {is_mine ? <button onClick={() => {history.push(`/edit/${post_index}`)}}>수정</button> : null}
            {is_mine ? <button onClick={deletePost}>삭제</button> : null}

            </div>
            
            <h3>
                {post_list[post_index].user}
            </h3>
            <Content>
                {post_list[post_index].date}
            </Content>
            <Img src={post_list[post_index].img_url} />

            <Content>
                {post_list[post_index].content}
            </Content>
        
        </Container>

    )
}

const Container = styled.div`
border: 1px solid #9c27b0;
text-align: left;
margin: auto;
width: 80%;
border-radius: 20px;
padding: 20px;

button {
background-color: #9c27b0;
color: white;
border: 1px solid #9c27b0;
padding: 10px 20px;
border-radius: 20px;
margin: auto;

}
`;

const Content = styled.div`
margin-top: 20px;
`;


const Img = styled.img`
object-fit:cover;
width:100%;
    height:100%;
    margin-top: 20px;
`;




export default Detail;