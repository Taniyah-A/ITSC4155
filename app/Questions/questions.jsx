import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
//import { mockQuestions } from "../src/data/mockQuestions";
//import { questionDb } from "../src/data/buddy_question";

//import { bg1 } from "../expoStuff/assets/images/bg1.jpg";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../../lib/api";

export default function QuestionsScreen() {

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);     
  const [difficulty, setDifficulty] = useState("easy");
  const scoreRef = useRef(0);

  const question = questions[questionIndex];


  //fetch all questions from the db
  useEffect(() => {
    fetchQuestions(difficulty); //fetch based on the difficulty
  },[]);

  const fetchQuestions = async (diff = "easy") => {
    try{
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/topics/1/questions?difficulty=${diff}&limit=10`, //changed to accept difficulty as the parameter
         {
          headers: {
            "Authorization": `Bearer ${token}` //sending the token 
          }
         }
      );
      const data = await response.json();

      const formatted = data.map((q) => ({
        id: q.id,
        question: q.question_text,
        correct_answer: q.correct_ans,
        choices: q.choices.map((c) => c.choice_text),
        choiceObjects: q.choices,

      }));

      setQuestions(formatted);
    }catch(error){
      console.error("Failed to fetch the questions:", error);
    }finally{
      setLoading(false);
    }
  };


  const handleSelect = async (choice) => {
    setSelected(choice);
    setShowFeedback(true); 

    const correct = choice === question.correct_answer;
    if (correct) setScore((prev) => prev + 1);
    scoreRef.current += 1;

    const choiceObj = question.choiceObjects.find(
      (c) => c.choice_text === choice //find the id of the choice selected

    );

     const token = await AsyncStorage.getItem("token");
     console.log("Token being sent:", token);

    try{
      const result = await fetch(
        `${API_BASE_URL}/questions/submit` ,{
          method: "POST",
          headers: {"Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
          },
          body: JSON.stringify({
            user_id: 1,
            question_id: question.id,
            answer_choice_id: choiceObj.id,
          }),
        }
      );
      const data = await result.json();
      console.log(" Submit response:", data); //testing data
    }catch(error){
      console.error("Failed to submit answer:", error);
    }
  };

  const handleNext = () => {
  const isLastQuestion = questionIndex + 1 >= questions.length;

  if (isLastQuestion) {
    if (scoreRef.current >= 10) { 
      if (difficulty === "easy") {
        setDifficulty("medium");
        setScore(0);
        scoreRef.current = 0; 
        setQuestionIndex(0);
        fetchQuestions("medium"); 
      } else if (difficulty === "medium") {
        setDifficulty("hard");
        setScore(0);
        scoreRef.current = 0; 
        setQuestionIndex(0);
        fetchQuestions("hard");   
      } else {
        router.replace("/ActivityMap");
      }
    } else {
      router.replace("/ActivityMap");
    }
  } else {
    setQuestionIndex((prev) => prev + 1);
  }

  setSelected(null);
  setShowFeedback(false);
};

  const handleHome = () => {
    setSelected(null);
    setShowFeedback(false);
    router.back(); //goes back to the activity map
};

  const isCorrect = question ? selected === question.correct_answer : false;
  const isWrong = showFeedback && !isCorrect;
  const isRight = showFeedback && isCorrect;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 100, fontSize: 18 }}>
          Loading questions...
        </Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 100, fontSize: 18 }}>
          No questions found
        </Text>
      </View>
    );
  }

  const ProgressBar = ({ percent }) => {
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(widthAnim, {
        toValue: percent,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }, [percent]);

    return (
      <View style={styles.progressTracker}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {question && (
        <>
        <View style={styles.topBar}>
          <ProgressBar
            style={styles.progressTracker}
            percent={((questionIndex + 1) / questions.length) * 100}
          />
          <TouchableOpacity style={styles.homeBtn} onPress={handleHome}>
                <Text style={{ fontSize: 20 }}>X</Text>
          </TouchableOpacity>
          
        </View>
        <Text style={styles.question}>{question.question}</Text>
          {/*background
          <ImageBackground
            source={ bg1}
            style={styles.mapBackground}
            resizeMode="cover"
          />*/}

          {/*//shows the choices displays correct answer regardless -> todo#2*/}
          <View style={styles.choicesGrid}>
            {question.choices.map((choice, i) => {
            const isSelected = selected === choice;
            const choiceStyles = [
              styles.choice,
              isSelected && styles.selected,
              showFeedback &&
                isCorrect &&
                choice === question.correct_answer &&
                styles.correctChoice,
              showFeedback &&
                isSelected &&
                !isCorrect &&
                styles.incorrectChoice,
            ];
            return (
              <TouchableOpacity
                key={i}
                style={choiceStyles}
                onPress={() => handleSelect(choice)}
                disabled={showFeedback}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            );
          })}
          </View>

          {showFeedback && (
  <View
    style={[
      styles.feedback,
      isRight && styles.correctFeedback,
      isWrong && styles.incorrectFeedback,
    ]}
  >
    {isRight && (
      <Text style={styles.feedbackText}>Excellent!</Text>
    )}

    {isWrong && (
      <Text style={{fontSize: 16, color: "#B00020", textAlign: "center"}}>
        Correct answer: {question.correct_answer}
      </Text>
    )}

    <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
      <Text style={styles.nextText}>Next Question</Text>
    </TouchableOpacity>
  </View>
)}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF6F2", //doesnt matter - should be a picture
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  question: { //deisgn for the box the question
    // flex: 2,
    // backgroundColor: "#FBF6F2",
    // borderRadius: 28,
    // padding: 28,
    // alignItems: "center",
    // borderWidth: 2,
    // borderColor: "#f9e1ce",
    // elevation: 6,
    // height: 80,
    // justifyContent: "center",
    // gap: 12,
    // fontSize: 20,
    // textAlign: "center",
    // marginTop: 40,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },

  /*choice: {
    flex: 3,
    backgroundColor: "#FBF6F2",
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#f9e1ce",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    shadowColor: "#8B7ECC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  choiceText: {
    fontSize: 24,
    textAlign: "center",
  },*/

  choicesGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: 12,
},

choice: {
  width: "48%",
  height: 120,
  backgroundColor: "#FFF",
  borderRadius: 16,
  borderWidth: 2,
  borderColor: "#E5E5E5",
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
},

choiceText: {
  fontSize: 18,
  fontWeight: "500",
},

  feedback: {
    // flex: 4,
    // alignItems: "center",
    // justifyContent: "center",
    // gap: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#D7FFB8",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  correctChoice: {
    //highlights the right answer
    backgroundColor: "#C8F499",
    borderColor: "#3DAE2C",
  },

  incorrectChoice: {
    //highlights the wrong answer
    backgroundColor: "#FDC4C4",
    borderColor: "#D13A3A",
  },

  correct: {
    //design for the bottom thing saying correct
    marginTop: 20,
    fontSize: 22,
    textAlign: "center",
    color: "#2F7A2F",
  },

  incorrect: {
    //design for the bottom thing saying the right answer
    //marginTop: 20,
    // flex: 3,
    // fontSize: 22,
    // textAlign: "center",
    // color: "#A72D2D",
    // opacity: 0.5,
    // borderRadius: 8,
    // width: "100%",
    // backgroundColor: "#FDC4C4",
    //height: "100%",
    fontSize: 16,
    color: "#B00020",
    textAlign: "center",
    marginBottom: 10,
  },

  nextBtn: {
    // marginTop: 50,
    // backgroundColor: "#5AF0F1",
    // padding: 12,
    // borderRadius: 8,
    // //flex: 2,
    // justifyContent: "flex-end",
    // opacity: 1.0,
    // alignSelf: "flex-end",
    backgroundColor: "#58CC02",
    paddingVertical: 14,
    borderRadius: 12,
  },

  nextText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },

  homeBtn: {
    width:36,
    paddingHorizontal: 10, 
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#f9e1ce",
    justifyContent: "center",
    alignItems: "center",
  },

  progressTracker: {
    flexDirection: "row",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    width: "70%",
    flex: 1,
  },

  fill: {
    height: "100%",
    backgroundColor: "#FFD166",
    borderRadius: 5,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
