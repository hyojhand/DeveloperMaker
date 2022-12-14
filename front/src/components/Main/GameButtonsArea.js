import React, { useState } from "react";
import Styled from "styled-components";
import LoginButtonsArea from "./LoginButtonsArea";
import GameRole from "./GameRole/GameRole.js"
import GameRuleImg from "../../asset/images/Main/GameRuleBtn.png";
import GameStartImg from "../../asset/images/Main/GameStartBtn.png";
import LogoutBtnImg from "../../asset/images/Main/LogoutBtn.png";
import ProfileBtnImg from "../../asset/images/Main/ProfileBtn.png";
import StudyBtnImg from "../../asset/images/Main/StudyBtn.png";
import AlbumBtnImg from "../../asset/images/Main/AlbumBtn.png";
import NewAlbumLogo from "../../asset/images/Album/NewAlbumLogo.png"
import { getNew } from "../../slices/albumSlice"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../../slices/userSlice";
import btnSound from "../../asset/soundEffects/buttonClick.wav";

const GameButtons = Styled.div`
  margin-top: 10%;
  height: 40%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const LoginGameButtons = Styled.div`
  margin-top: -5%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const BtnArea = Styled.div`
  margin-top: 5%;
  height: 40%;
  width: 50%;
  border-radius: 50%;
`;
const GameBtn = Styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 2.4vw;
  cursor: pointer;

  // 텍스트 효과부분
  // // box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.2 );
  // backdrop-filter: blur( 6.5px );
  // -webkit-backdrop-filter: blur( 6.5px );
  // border-radius: 1vw;
  text-shadow: 0.1vw 0.1vw #000, 0.1vw 0.1vw #000, 0.1vw 0.1vw #000, 0.1vw 0.1vw #000;



  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  border: 0ch;
  color: white;
  transition: all ease 0.1s;

  &:hover {
    transform: scale(1.05);
  }
`;

const NewAlbum = Styled.img`
  position: absolute;
  margin-left: 3vw;
  height: 2.5vw;
  width: 3vw;
`;

const GameButtonsArea = () => {
  const isLogIn = useSelector(state => state.user.isLogIn )
  const userInfo = useSelector(state => state.user.userInfo);
  // 새앨범 여부 확인
  const [newAlbum, setNewAlbum] = useState(false)
  const isShowLogin = useSelector(state => state.user.isShowLogin);
  const [isShowGameRole, setIsShowGameRole] = useState(false)
  const dispatch = useDispatch()
  useEffect(()=> {
    // userInfo가 없이 실행될 경우 토큰을 보내지 않아서 album/new 요청이 안됨 new가 무조건 생기게 됨
    if (userInfo) {
      const newCheck = async() => {
        const response = await dispatch(getNew())
        setNewAlbum(response.payload)
      }
      newCheck()
    }
  }, [dispatch, userInfo])

  const navigate = useNavigate();

  // const purge = async () => {
  //   await sessionStorage.clear();
  //   window.location.reload();
  // };

  // 이동 함수
  const goGame = () => {
    playBtnSound()
    navigate("/Game")
  }
  const goProfile = () =>{
    playBtnSound()
    navigate("/Profile")
  }
  const goSelfStudy = () => {
    playBtnSound()
    navigate("/SelfStudy")
  }
  const goAlbum = () => {
    playBtnSound()
    navigate("/Album")
  }

  const playBtnSound = () => {
    const sound = new Audio()
    sound.src = btnSound
    sound.play()
  }

  return (
    <>
      {isLogIn ? (
        <LoginGameButtons>
          <BtnArea>
            <GameBtn src={GameStartImg} alt="GameStart" onClick={goGame}>스토리모드</GameBtn>
          </BtnArea>
          <BtnArea>
            <GameBtn src={ProfileBtnImg} alt="Profile" onClick={goProfile}>내정보/랭킹</GameBtn>
          </BtnArea>
          <BtnArea>
            <GameBtn src={StudyBtnImg} alt="Study" onClick={goSelfStudy}>자율학습</GameBtn>
          </BtnArea>
          <BtnArea>
            {newAlbum && <NewAlbum src={NewAlbumLogo} alt="New" />}
            <GameBtn src={AlbumBtnImg} alt="Album" onClick={goAlbum}>앨범</GameBtn>
          </BtnArea>
          {/* <BtnArea>
            <GameBtn src={StudyBtnImg} alt="Study" onClick={goSelfStudy}>랭킹</GameBtn>
          </BtnArea> */}
          <BtnArea>
            <GameBtn src={GameRuleImg} alt="GameRule" onClick={() => {playBtnSound(); setIsShowGameRole(true)}}>게임소개</GameBtn>
          </BtnArea>
          <BtnArea>
            <GameBtn src={LogoutBtnImg} alt="Logout" onClick={() => {dispatch(userLogout())}}>
              로그아웃
            </GameBtn>
          </BtnArea>
        </LoginGameButtons>
      ) : (
        <GameButtons>
          <br />
          <BtnArea>
            <GameBtn src={GameRuleImg} alt="GameRule" onClick={() => {playBtnSound(); setIsShowGameRole(true)}}>게임소개</GameBtn>
          </BtnArea>
          <br />
          {
            isShowLogin ? (
              <LoginButtonsArea />
              ): (
              <BtnArea>
                <GameBtn src={GameStartImg} alt="GameStart" onClick={() => {dispatch({type: "user/showLoginBtn"})}}>게임시작</GameBtn>
              </BtnArea>
            )
          }
        </GameButtons>
      )}
      {
        isShowGameRole?
        <div onClick={() => {setIsShowGameRole(false)}}>
          <GameRole></GameRole>
        </div>
        : null
      }
    </>
  );
};

export default GameButtonsArea;
