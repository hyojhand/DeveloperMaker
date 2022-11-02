import React, {useState} from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

const CodeTextarea = (prop) => {
  const [code, setCode] = useState(
    `### 여기에 코드를 작성하세요 ###`
  );


  return (
    <CodeEditor
      value={code}
      language={prop.lang}
      placeholder="코드를 작성해주세요."
      onChange={(evn) => 
        {
          setCode(evn.target.value)
          // console.log(evn.target.value)
        }
      }
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: 'Jua, sans-serif',
        marginLeft: "55vw",
        width: "40vw",
        height: "80vh",
      }}
    />
  );
}

export default CodeTextarea;