import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"; 
import { Audio } from "expo-av";
//import { mockQuestions } from "../src/data/mockQuestions";
//import { questionDb } from "../src/data/buddy_question";

//import { bg1 } from "../expoStuff/assets/images/bg1.jpg";


import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../lib/api";

export default function QuestionsScreen() {
  // Load the sounds at the beginning to avoid lag.
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);     
  const [difficulty, setDifficulty] = useState("easy");
  const scoreRef = useRef(0);
  const { topicId } = useLocalSearchParams(); 

  const backgrounds = [
    require("../../assets/images/bg1.jpg"),
    require("../../assets/images/bg2.jpg"),

  ];

  const [randomBg, setRandomBg] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)],
  );

  const question = questions[questionIndex];


  //fetch all questions from the db
  useEffect(() => {
    fetchQuestions(difficulty); //fetch based on the difficulty
  },[]);

  useEffect(() => {
    let isMounted = true;
    const loadSounds = async () => {
      const soundSetting = await AsyncStorage.getItem("soundEnabled");
      const isEnabled = soundSetting ? JSON.parse(soundSetting) : false;
      if (!isEnabled) return;

      const { sound: correct } = await Audio.Sound.createAsync(
        require("../../assets/images/audios/correctAns_audio.mp3")
      );

      const { sound: wrong } = await Audio.Sound.createAsync(
        require("../../assets/images/audios/wrongAns_audio.mp3")
      );

      if (isMounted) {
        correctSoundRef.current = correct;
        wrongSoundRef.current = wrong;
      }
    };

    loadSounds();

    return () => {
      isMounted = false;
      correctSoundRef.current?.unloadAsync?.();
      wrongSoundRef.current?.unloadAsync?.();
    };
  }, []);

  const fetchQuestions = async (diff = "easy") => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/topics/${topicId}/questions?difficulty=${diff}&limit=10`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    
    const data = await response.json();
    

    const questions = Array.isArray(data) ? data : data.questions ?? data.items ?? data.data ?? [];
    

    const formatted = questions.map((q) => ({
      id: q.id,
      question: q.question_text,
      correct_answer: (q.correct_ans ?? q.correct_answer ?? q.answer ?? "").trim(),
      choices: q.choices.map((c) => (c.choice_text ?? "").trim()),
      choiceObjects: q.choices,
    }));

    setQuestions(formatted);
  } catch (error) {
    console.error("Failed to fetch the questions:", error);
  } finally {
    setLoading(false);
  }
};

  const handleSelect = async (choice) => {
    console.log("Selected:", JSON.stringify(choice));
    console.log("Correct:", JSON.stringify(question.correct_answer));
    console.log("Match:", choice === question.correct_answer);
    setSelected(choice);
    setShowFeedback(true); 

    const correct = choice === question.correct_answer;
    

    if (correct) {
      setScore((prev) => prev + 1);
      scoreRef.current += 1;

      correctSoundRef.current?.replayAsync?.();
    } else {
      wrongSoundRef.current?.replayAsync?.();
    }

    const choiceObj = question.choiceObjects.find(
      (c) => c.choice_text === choice //find the id of the choice selected

    );

     const token = await AsyncStorage.getItem("token");
     console.log("Token being sent:", token);

    try{
      const result = await fetch(
        `${API_BASE_URL}/questions/answer?question_id=${question.id}&answer=${choice}` ,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      const text = await result.text();
      console.log(" RAW response", text); //testing

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.log("Response is not JSON");
      }
      console.log("Reponse is not JSON");
    }catch(error){
      console.error("Failed to submit answer:", error);
    }
  };

  const handleNext = () => {
  const isLastQuestion = questionIndex + 1 >= questions.length;

  if (isLastQuestion) {
    if (scoreRef.current >= 10) { 
      playSoundEffect(require("../../assets/images/audios/level_complete.mp3"));
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

  const tryAgainFunc = () => {
    setSelected(null);
    setShowFeedback(false);
    setQuestionIndex(questionIndex);
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
    <ImageBackground source={randomBg} style={styles.screenBackground}>
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
        <View style={styles.question}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>
         
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
         <TouchableOpacity
            style={styles.nextBtnCorrect}
            onPress={handleNext}
         >
         <Text style={styles.nextText}>Next Question</Text>
         </TouchableOpacity>
        </View>

    )}

    {isWrong && (
       <View>
           <TouchableOpacity
              style={styles.nextBtnIncorrect}
              onPress={tryAgainFunc}
            >
              <Text style={styles.nextText}>Try again!</Text>
            </TouchableOpacity>
        </View>
    )}
    </View>
)}
        </>
      )}
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#FBF6F2", //doesnt matter - should be a picture
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  question: { //deisgn for the box the question
    elevation: 6,
    height: 150,
    gap: 10,
    marginTop: 80,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
    backgroundColor: "#FFF9F3",
    borderRadius: 18,
    borderColor: "#f9e1ce",
    borderWidth: 2.5,
  },

  questionText: {
    color: "#4f2300",
    fontSize: 30,
    fontWeight: "500",
    textAlign: "center",
    paddingTop: 40,
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
    marginBottom: 10,
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
    marginTop: 30,
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
    width: 36,
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

  screenBackground: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    blurRadius: 100,
  },
});