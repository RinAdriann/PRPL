import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import DragDropQuiz, { Mapping } from "@/components/DragDropQuiz";
import { useChild } from "@/state/ChildContext";

type Question = {
  id: number;
  type: "MATCHING";
  prompt: string;
  items: { items: { key: string; label: string }[] };
  targets: { targets: { key: string; label: string }[] };
  answerMap: Record<string, string>;
};

type Quiz = {
  id: number;
  topic: string;
  difficulty: string;
  questions: Question[];
};

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
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

  if (!quiz) return <div className="container">Loading...</div>;

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

  async function submit() {
    try {
      const payload = {
        childId,
        quizId: Number(quizId),
        answers: quiz.questions.map(q => ({ questionId: q.id, mapping: mappings[q.id] || {} })),
      };
      const res = await api.post("/quizzes/submit", payload);
      setFinished({ score: res.data.score, passed: res.data.passed });
      if (res.data.passed) {
        setTimeout(() => navigate("/progress"), 1500);
      }
    } catch {
      alert("Submission failed");
    }
  }

  const allAnswered = quiz.questions.every(q => feedback[q.id] !== null && mappings[q.id] && Object.keys(mappings[q.id]).length >= Object.keys(q.answerMap).length);

  return (
    <div className="container">
      <h2>Quiz</h2>
      {quiz.questions.map(q => (
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
      ))}
      <div className="controls">
        <button className="btn green" onClick={submit} disabled={!allAnswered}>Finish Quiz</button>
      </div>

      {finished && (
        <div className="feedback" style={{ fontSize: 24, marginTop: 12 }}>
          Score: {finished.score}% — {finished.passed ? "🎉 Quiz Finished! Badge awarded!" : "🔁 Try Again"}
        </div>
      )}
    </div>
  );
}
