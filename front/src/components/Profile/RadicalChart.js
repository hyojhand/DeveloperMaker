import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import "chart.js/auto"; // import 안하면 차트 오류남
import { Radar, PolarArea } from "react-chartjs-2"; // 차트종류
import "../../pages/Profile/Profile.css"
import { getProgress } from '../../slices/userSlice';
import { defaults } from 'chart.js';

const RadicalChart = () => {
  const dispatch = useDispatch()
  const progress = useSelector((state)=>{
    return state.user.progress.study
  })
  const nickname = useSelector((state)=>{
    return state.user.userInfo.nickname
  })

  // 자율학습 진행도
  const data = {
    labels: [
      'CS(%)',
      'Algorithm(%)',
      'Front(%)',
      'Back(%)',
      'Language(%)',
    ],
    // DB
    datasets: [{
      label: `${nickname}의 자율학습 진행도`,
      data: [progress.cs, progress.algorithm, progress.frontend, progress.backend, progress.language],
      fill: true,
      // backgroundColor: [
      //   'rgb(255, 205, 86)',
      //   'rgb(200, 100, 0)',
      //   'rgb(220, 220, 220)',
      //   'rgb(100, 120, 255)',
      //   'rgb(255, 100, 100)',
      // ],
      borderWidth: 1.5,
      // borderColor: 'rgb(255, 99, 132)',
      // pointBackgroundColor: 'rgb(255, 99, 132)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  };
  // 옵션들
  const config = {
    type: 'radar',
    data: data,
    // 옵션
    // 효과
    animation: {
      animateScale: true,
    },
    // 폰트 관리
    plugins:{
      legend: {
        labels: {
          font: {
            size: "12vw",
            family: "'Jua', sans-serif",
          }
        }
      },
      datalabels:{
        // color:'#876445'
      }
    },
    // 척도
    scales: {
      legend: {
        display: false
      },
      r: {
        max: 100,
        min: 0,
        // 범례 설정
        ticks: {
          stepSize: 20,
          backdropColor: "rgba(0, 0, 0, 0)",
          // color: "#92817A"
        },   
      }
    },

  }
  // 유저 DTO 업데이트
  useEffect(()=> {
    defaults.font.family = "'Jua', sans-serif"
    defaults.font.size = 12
    dispatch(getProgress())
  },[dispatch])
  console.log('자율학습 진행도', progress)
  return (
    <div className='ProfileRadicalChart'>
      <Radar data={data} options={config} />    
    </div> 
  );
};

export default RadicalChart;
