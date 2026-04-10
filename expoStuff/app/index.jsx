import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { mockQuestions } from "../src/data/mockQuestions";
//import { questionDb } from "../src/data/buddy_question";

//import { bg1 } from "../expoStuff/assets/images/bg1.jpg";

export default function QuestionsScreen() {
  const [questionIndex, setQuestionIndex] = useState(0); // change to use the actual db
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = mockQuestions[questionIndex]; //change to use actual db
  //using database ahhh
  //const dbQuestion = questionDb[questionIndex];
  const { width } = Dimensions.get("window");

  const handleSelect = (choice) => {
    setSelected(choice);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setQuestionIndex((prev) => (prev + 1) % mockQuestions.length);
    setSelected(null);
    setShowFeedback(false);
  };

  const handleHome = () => { //come back
    setSelected(null);
    setShowFeedback(false);
  };

  const isCorrect = selected === question.correct_answer;
  const isWrong = showFeedback && !isCorrect;
  const isRight = showFeedback && isCorrect;

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
            percent={((questionIndex + 1) / mockQuestions.length) * 100}
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
      isRight && styles.feedbackCorrect,
      isWrong && styles.feedbackIncorrect,
    ]}
  >
    {isRight && (
      <View>
        <Text style={styles.feedbackTextCorrect}>Excellent!</Text>
        <TouchableOpacity style={styles.nextBtnCorrect} onPress={handleNext}>
          <Text style={styles.nextText}>Next Question</Text>
        </TouchableOpacity>
    </View>
    )}

    {isWrong && (
      <View>
        <Text style={styles.feedbackTextIncorrect}>
          Correct answer: {question.correct_answer}
        </Text>
        <TouchableOpacity style={styles.nextBtnIncorrect} onPress={handleNext}>
          <Text style={styles.nextText}>Next Question</Text>
        </TouchableOpacity>
    </View>

    )}

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
    elevation: 6,
    height: 100,
    gap: 12,
    marginTop: 40,
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
    color: "#4f2300",
  },

  choicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  choice: {
    width: "48%",
    height: 120,
    backgroundColor: "#fdf6f1",
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#f9e1ce",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  choiceText: {
    fontSize: 20,
    fontWeight: "500",
  },

  feedbackCorrect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#D7FFB8",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 150,
  },

  feedbackTextCorrect: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#58CC02",
  },

  feedbackIncorrect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FDC4C4",
    padding: 20,
    height: 150,
  },

  feedbackTextIncorrect: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#D13A3A",
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
    fontSize: 16,
    color: "#B00020",
    textAlign: "center",
    marginBottom: 10,
  },

  nextBtnCorrect: {
    backgroundColor: "#58CC02",
    paddingVertical: 14,
    borderRadius: 12,
  },

  nextBtnIncorrect: {
    backgroundColor: "#D13A3A",
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
    borderColor: "#e7c7ad",
    borderWidth: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
