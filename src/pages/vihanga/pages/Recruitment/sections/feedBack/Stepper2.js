// import React from "react";

// const Stepper = ({ activeStep = 1 }) => {
//   const steps = ["Objective", "KR", "Task"];

//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.container}>
//         {steps.map((step, index) => {
//           const isCompleted = index < activeStep;
//           const isActive = index === activeStep;
//           const isLast = index === steps.length - 1;

//           const outerBorderColor = isCompleted || isActive ? "#73712A" : "#aaa";
//           const innerColor = isCompleted
//             ? "#73712A"
//             : isActive
//             ? "#73712A"
//             : "#aaa";

//           return (
//             <div key={index} style={styles.stepItem}>
//               <div style={styles.label(isCompleted || isActive)}>{step}</div>
//               <div style={styles.circleWrapper}>
//                 <div
//                   style={{
//                     ...styles.circleOuter,
//                     borderColor: outerBorderColor,
//                   }}
//                 >
//                   <div
//                     style={{
//                       ...styles.circleInner,
//                       backgroundColor: innerColor,
//                     }}
//                   />
//                 </div>
//                 {!isLast && (
//                   <div
//                     style={{
//                       ...styles.line,
//                       backgroundColor: isCompleted ? "#73712A" : "#ccc",
//                     }}
//                   />
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     width: "100%",
//     margin: "0 auto",
//   },
//   container: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     padding: "20px",
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
//     width: "100%",
//   },
//   stepItem: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     flex: 1,
//     position: "relative",
//   },
//   circleWrapper: {
//     display: "flex",
//     alignItems: "center",
//     width: "100%",
//     position: "relative",
//     justifyContent: "center",
//   },
//   circleOuter: {
//     width: 24,
//     height: 24,
//     borderRadius: "50%",
//     border: "2px solid",
//     backgroundColor: "#fff",
//     zIndex: 2,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   circleInner: {
//     width: 13,
//     height: 13,
//     borderRadius: "50%",
//   },
//   line: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translateY(-50%)",
//     height: 4,
//     width: "100%",
//     backgroundColor: "#ccc",
//     zIndex: 1,
//   },
//   label: (active) => ({
//     marginBottom: 8,
//     fontWeight: 600,
//     fontSize: 14,
//     color: active ? "#73712A" : "#aaa",
//     textAlign: "center",
//   }),
// };

// export default Stepper;
