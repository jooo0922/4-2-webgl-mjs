"use strict";

// 타입 배열을 전달받아 문자열로 변환해서 리턴해주는 함수
function convertToString(array) {
  let stringRep = ""; // 타입 배열에 담긴 행렬 및 벡터 데이터를 변환하여 문자열로 저장할 변수
  for (let i = 0; i < array.length; i++) {
    stringRep = stringRep + array[i] + " "; // 띄어쓰기를 추가해서 요소(벡터 성분 또는 행렬 원소) 사이를 구분함.
  }
  return stringRep;
}

function testMjsJsLibrary() {
  // 벡터 연산에 사용할 두 벡터 u, v 생성
  // Sylvester와 달리 배열로 묶어서 넣는 게 아닌, 각각의 원소들을 인자로 직접 넣어서 만들어 줌.
  const u = V3.$(1, 2, 3);
  const v = V3.$(4, 5, 6);

  // 두 벡터 u, v의 합
  const s = V3.add(u, v);
  console.log("벡터의 합: ", convertToString(s)); // WebGL-mjs는 결과값이 항상 타입 배열이므로, 이를 문자열로 변환해서 console에 찍어줌.

  // 두 벡터 u, v의 내적(스칼라 곱)
  const d = V3.dot(u, v);
  console.log("벡터의 내적: ", d); // Sylvester와 마찬가지로 내적의 결과값은 항상 스칼라이므로, 리턴값도 타입 배열이 아닌 숫자로 나옴.

  // 두 벡터 u, v의 외적
  const c = V3.cross(u, v);
  console.log("벡터의 외적: ", convertToString(c));

  // 행렬 연산에 사용할 두 행렬 M, N 생성
  // WebGL-mjs 에서는 선형대수학, Sylvester와 다르게 '열 우선 행렬' 방식으로 행렬을 표기함.
  // 즉, 행렬 요소를 열 순으로 추가하고 저장하며, 그렇기 때문에 console에 찍을 때도 열 순으로 찍힘.
  const M = M4x4.$(
    1,
    0,
    0,
    0, // 첫 번째 열(행 아님 주의!! '열 순으로' 행렬 생성)
    0,
    1,
    0,
    0, // 두 번째 열
    0,
    0,
    1,
    0, // 세 번째 열
    2,
    3,
    4,
    1 // 네 번째 열
  ); // 4 * 4 행렬 생성(참고로, WebGL-mjs는 4 * 4 행렬만 취급 및 생성 가능함.)
  const I = M4x4.$(
    1,
    0,
    0,
    0, // 첫 번째 열
    0,
    1,
    0,
    0, // 두 번째 열
    0,
    0,
    1,
    0, // 세 번째 열
    0,
    0,
    0,
    1 // 네 번째 열
  ); // 4 * 4 단위 행렬을 만듦.

  // 두 행렬 M, N의 곱셈
  const MI = M4x4.mul(M, I);
  console.log(
    "행렬의 곱셈: ",
    convertToString(MI),
    `${convertToString(MI) === convertToString(M)}` // 어떤 행렬 * 단위 행렬의 곱셈의 결과값은 자기 자신과 같음.
  );

  // 이동 변환에 필요한 4 * 4 이동 행렬 생성. p.72 이동 행렬 예시와 구조가 동일함.
  const T = M4x4.makeTranslate3(2, 3, 4);
  console.log("이동 행렬: ", convertToString(T)); // 이제 T를 동차좌표로 변환된 열 벡터에 행렬 곱 해주면 이동 변환이 되는 것.
}

/**
 * WebGL-mjs에서 벡터 및 행렬 연산의 결과값에 대하여...
 *
 * WebGL-mjs는 연산 결과로 타입 배열(형식화 배열)을 리턴해 줌.
 * 왜냐하면, 이전 예제에서도 살펴봤지만 WebGL에서는 버텍스 데이터 등의 데이터를
 * 타입 배열을 통해 바이너리 데이터로 변환해서 사용하기 떄문!
 *
 * 이러한 점 때문에 책에서 WebGL-mjs가 Sylvester같은 라이브러리보다
 * WebGL에 특화되어 만들어졌다고 표현하는 것 같음.
 *
 * 어쨋거나, WebGL-mjs의 연산 결과를 확인하려면
 * 문자열로 보기 좋게 변환해야 할 필요가 있음.
 * 그래서 convertToString() 같은 함수를 따로 만들어서,
 * 인자로 받은 타입 배열 형태의 결과값을 문자열로 변환해서 리턴해주는 작업을 추가해줘야 함!
 */

/**
 * WebGL-mjs의 또 다른 특징
 *
 * WebGL-mjs은 모든 행렬과 벡터를 다루지 않음.
 * 정확히 말하면 4*4 행렬과 3개의 원소로 구성된 벡터만 취급함.
 *
 * 왜냐하면, WebGL이 행렬을 사용할 때는 '4 * 4 행렬'을 이용한
 * 아핀 변환인 경우 외에는 딱히 행렬을 사용할 일이 없으니까
 * 4*4 행렬 외에는 따로 필요가 없는 것.
 *
 * 마찬가지로 WebGL이 (x, y, z) 요렇게 3개의 원소로 좌표값을 표현하니까
 * 3개의 원소로 구성된 벡터 말고는 따로 필요가 없겠지.
 *
 * -> 이러한 부분들이 WebGL에 특화되어 있다고 말하는 것!
 */
