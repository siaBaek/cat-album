// fetch()
//   .then((res) => {
//     if (!res.ok) {
//       alert("http 오류");
//     }
//     return res.json();
//   })
//   .then((myJson) => {
//     console.log(JSON.stringify(myJson));
//   })
//   .catch((e) => {
//     alert(e.message);
//   });

const API_END_POINT =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

export const request = (nodeId) => {
  try {
    const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ""}`);

    if (!res.ok) {
      alert("서버 상태 이상");
      //   throw new Error('서버 상태 이상')
    }
    return await res.json();
  } catch (e) {
    alert(`무언가 잘못됨 ${e.message}`);
    // throw new Error(`무언가 잘못됨 ${e.message}`);
  }
};
