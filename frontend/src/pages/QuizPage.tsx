import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from '@/services/api'
import DragDropQuiz, { Mapping } from "@/components/DragDropQuiz";
import { useChild } from "@/state/ChildContext";

type Choice = { id: string; text: string; correct?: boolean }
type Question = { id: string; text: string; choices: Choice[]; selected?: string }
type Quiz = { id: string; title: string; questions: Question[] }

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [mappings, setMappings] = useState<Record<number, Mapping>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
  const [finished, setFinished] = useState<{ score: number; passed: boolean } | null>(null);
  const { childId } = useChild();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/quizzes/${quizId}`);
        setQuiz(res.data);
        setMappings({});
        setFeedback({});
        setFinished(null);
      } catch {
        alert("Quiz not available");
      }
    }
    load();
  }, [quizId]);

  // Guard before render
  if (!quiz) return null

  function onChangeMapping(qId: number, map: Mapping) {
    setMappings(prev => ({ ...prev, [qId]: map }));
    // local instant feedback when fully matched
    const q = quiz.questions.find(q => q.id === qId)!;
    const keys = Object.keys(q.answerMap);
    const allPlaced = keys.every(k => map[k]);
    if (allPlaced) {
      const correct = keys.every(k => map[k] === q.answerMap[k]);
      setFeedback(f => ({ ...f, [qId]: correct }));
      const snd = new Audio(correct ? "/assets/sounds/happy.mp3" : "/assets/sounds/try-again.mp3");
      snd.play().catch(()=>{});
    } else {
      setFeedback(f => ({ ...f, [qId]: null }));
    }
  }

  // Guard in actions
  const submitAnswers = async () => {
    if (!quiz) return
    await api.submitQuiz(quiz.id, {/* payload */})
  }

  const allAnswered = quiz.questions.every(q => feedback[q.id] !== null && mappings[q.id] && Object.keys(mappings[q.id]).length >= Object.keys(q.answerMap).length);

  // If you have no interfaces yet, minimally type the items:
  const renderQuestions = () => (
    quiz?.questions.map((q: any) => (
      <div key={q.id} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>{q.prompt}</div>
        <DragDropQuiz
          items={q.items.items}
          targets={q.targets.targets}
          onChange={(m) => onChangeMapping(q.id, m)}
        />
        <div className="feedback">
          {feedback[q.id] === true && <span style={{ color: "green" }}>⭐ Great job!</span>}
          {feedback[q.id] === false && <span style={{ color: "tomato" }}>Try again!</span>}
        </div>
      </div>
    ))
  )

  const collectAnswers = () => {
    const answers = quiz?.questions.map((q: any) => {
      return { id: q.id, answer: q.selected }
    }) || []
    return answers
  }

  const scoreQuiz = () => {
    const score = quiz?.questions.reduce((acc: number, q: any) => {
      return acc
    }, 0) ?? 0
    return score
  }

  return (
    <div className="container">
      <h2>Quiz</h2>
      {renderQuestions()}
      <div className="controls">
        <button className="btn green" onClick={submitAnswers} disabled={!allAnswered}>Finish Quiz</button>
      </div>

      {finished && (
        <div className="feedback" style={{ fontSize: 24, marginTop: 12 }}>
          Score: {finished.score}% — {finished.passed ? "🎉 Quiz Finished! Badge awarded!" : "🔁 Try Again"}
        </div>
      )}
    </div>
  );
}
