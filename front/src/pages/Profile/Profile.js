import React, {useState, useEffect} from 'react';
import "./Profile.css"
import RadicalChart from '../../components/Profile/RadicalChart';
import UserInfo from '../../components/Profile/UserInfo';
import StoryAlbumChart from '../../components/Profile/StoryAlbumChart';
import StudyAlbumChart from '../../components/Profile/StudyAlbumChart';
import LikeChart from '../../components/Profile/LikeChart';
import { userGetMemory } from "../../slices/storySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAlbumProgress, getProgress, DeleteUser } from '../../slices/userSlice';
import MainImg from "../../asset/images/Main/gohomeIcon.png"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Profile = () => {
  const navigate = useNavigate()
  const [likeSel, setLikeSel] = useState(1)
  const loadData = useSelector((state) => state.story.userStoryData)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(userGetMemory())
    dispatch(getAlbumProgress())
    dispatch(getProgress())
  }, [dispatch]);
  function goMain() {
    navigate('/')
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='ProfileBack'>
      <UserInfo />
      <div className='ProfileProgressChart'>
        <StoryAlbumChart />
        <StudyAlbumChart />
        <RadicalChart />
      </div>
      {/* 데이터별 진행도 */}
      <div className="ProfileLikeChartBack">
        {[1,2,3].map((idx) => {return (<span className={'ProfileLikeBtn' + (likeSel === idx ? " ProfileLikeBtnSel" : "" )} key={`btn-${idx}`} onClick={()=>{setLikeSel(idx)}}>{idx}번</span>) })}
        {loadData.map((data,idx)=> {return (<LikeChart key={`LikeChart-${idx}`} data={data} show={likeSel === idx+1} />) })}
      </div>
      <img src={MainImg} alt="MainBtn" className='ProfileMainBtn' onClick={goMain} />
      <p className='ProfileDelete' onClick={handleShow} >회원탈퇴</p>
      <>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>DeveloperMaker 탈퇴</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={MainImg} className="ProfileDeleteImg" alt="" />
            정말로 탈퇴하시나요...</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={()=>{dispatch(DeleteUser()); navigate('/')}}>회원탈퇴</Button>
            <Button variant="secondary" onClick={handleClose}>취소</Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default Profile;
