import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { modalNotify } from "../../features/modal/modalSlice";
import jwtDecode from 'jwt-decode'
import moment from "moment";
import CommentForm from './CommentForm'
import comicApi from "../../api/comicApi";
import { WARN_LOGIN } from "../../constants";
import commentApi from '../../api/commentApi'

const SubComment = ({
    userName = 'NaN',
    subComments,
    setActiveComment,
    isReplying,
    replyId,
    comicId
}) => {
    const [showBtnGetAll, setShowBtnGetAll] = useState(false)
    const [currentSubComments, setCurrentSubComments] = useState(() => {
        let cmt = [...subComments]
        if (cmt.length > 1) {
            cmt.length = 1
            setShowBtnGetAll(true)
        }

        return cmt
    })

    const [clickGetAll, setClickGetAll] = useState(false)
    const { userInfo, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();


    const items = useMemo(() => {
        return generateItems(currentSubComments, token)
    }, [token, currentSubComments])

    const handleGetAll = async () => {
        setClickGetAll(true)
        let res = await commentApi.getByParentId(replyId)
        let data = res.data.data.rows
        setCurrentSubComments([...data])
    }

    const addComment = (text, parentId) => {
        comicApi
            .createComment(comicId, text, parentId, token)
            .then((res) => {
                if (res.data.data) {
                    const data = res.data.data;
                    data.subComments = [];
                    data.user_info = {
                        user_name: userInfo.user_name,
                        user_image: userInfo.user_image,
                        user_email: userInfo.user_email,
                    };

                    setCurrentSubComments([data, ...currentSubComments])
                }
            })
            .catch((err) => {
                dispatch(
                    modalNotify({
                        show: true,
                        message: null,
                        error: WARN_LOGIN,
                    })
                );
            });
    };

    return (
        <>
            <div className="sub-comment">
                {isReplying && (
                    <CommentForm
                        username={userName}
                        handleSubmit={(text) => {
                            addComment(text, replyId)
                            setActiveComment(-1)
                        }}
                    ></CommentForm>
                )}
                {items !== null && items}
                {(!clickGetAll && showBtnGetAll) && (<button className='btn-all-cmt' onClick={handleGetAll}>Xem toàn bộ...</button>)}
            </div>
        </>
    )
}

export default SubComment

const generateItems = (subComments, token) => {
    if (!Array.isArray(subComments) || subComments.length <= 0) return null

    let currentUserUid = jwtDecode(token).user_uuid

    const items = (
        <ul>
            {subComments.map((item, index) => {
                const date = moment(item.createdAt).format("L LTS");
                return (
                    <li className="item-comment" key={`${item.comment_id}`}>
                        <div className="image-li-content-comment">
                            <img
                                className="img-comment"
                                src={`https://ui-avatars.com/api/name=${item.user_info.user_name}&background=random`}
                            ></img>
                            <span className="role-user-comment bg-user-type-1">Thành viên</span>
                        </div>
                        <div className="content-li-content-commnet">
                            <div className="h3-span-content-li-content-commnet">
                                <h3>{item.user_info.user_name}</h3>
                                {currentUserUid === item.user_uuid && (<span>{"<You>"}</span>)}
                                <span>{date}</span>
                            </div>
                            <span className="summary-content-li-content-commnet">
                                {`${item.comment_content}`}
                            </span>
                        </div>
                    </li>
                )
            })}
        </ul>



    )

    return items
}