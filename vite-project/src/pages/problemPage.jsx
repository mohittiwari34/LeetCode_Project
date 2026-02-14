import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from "../Utils/axiosClient"
import SubmissionHistory from '../component/submissionHistory';
import ChatAi from '../component/chatAi';
import Editorial from '../component/Editorial';
import { Play, Send, CheckCircle, XCircle, RotateCcw, MessageSquare, FileText, Code2, History, ChevronLeft, Menu } from 'lucide-react';
import LockedContent from '../component/LockedContent';

const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javascript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const selectedLang = langMap[selectedLanguage];
        const foundCode = response.data.startCode?.find(sc => sc.language === selectedLang);
        const initialCode = foundCode ? foundCode.intialCode : '// Write your code here';

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem?.startCode) {
      const selectedLang = langMap[selectedLanguage];
      const foundCode = problem.startCode.find(sc => sc.language === selectedLang);
      const initialCode = foundCode ? foundCode.intialCode : '// Write your code here';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    setActiveRightTab('testcase'); // Auto-switch to testcase view

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setIsRunning(false);
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setActiveRightTab('result'); // Auto-switch to result view

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      if (response.data.accepted) {
        await axiosClient.post('/user/save/streak', {});
      }

      setSubmitResult(response.data);
      setIsSubmitting(false);

    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setIsSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'hard': return 'text-error bg-error/10 border-error/20';
      default: return 'text-base-content bg-base-200';
    }
  };

  // Helper function to safe decode base64
  const safeDecode = (str) => {
    try {
      if (!str) return '';
      return atob(str);
    } catch (e) {
      console.warn('Failed to decode:', str);
      return str;
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold opacity-50">Problem not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-200 font-sans overflow-hidden">
      {/* Navigation Header */}
      <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="btn btn-ghost btn-square btn-sm hover:bg-base-200">
            <ChevronLeft size={20} />
          </NavLink>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg truncate max-w-[200px] md:max-w-md">{problem.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={`btn btn-sm ${isRunning ? 'btn-disabled opacity-50' : 'btn-ghost bg-base-200 hover:bg-base-300'} gap-2 transition-all`}
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? <span className="loading loading-spinner loading-xs"></span> : <Play size={16} className="text-base-content/70" />}
            <span className="hidden md:inline">Run</span>
          </button>
          <button
            className={`btn btn-sm btn-primary gap-2 shadow-lg shadow-primary/20 ${isSubmitting ? 'loading' : ''}`}
            onClick={handleSubmitCode}
            disabled={isSubmitting || isRunning}
          >
            {!isSubmitting && <Send size={16} />}
            Submit
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Problem Details */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-r border-base-300 bg-base-100/50 backdrop-blur-sm order-2 md:order-1">
          {/* Custom Tabs */}
          <div className="flex items-center gap-1 p-2 bg-base-200/50 border-b border-base-300 overflow-x-auto no-scrollbar">
            {[
              { id: 'description', icon: FileText, label: 'Description' },
              { id: 'editorial', icon: FileText, label: 'Editorial' },
              { id: 'solutions', icon: Code2, label: 'Solutions' },
              { id: 'submissions', icon: History, label: 'Submissions' },
              { id: 'chatAI', icon: MessageSquare, label: 'AI Chat' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id)}
                className={`btn btn-sm btn-ghost gap-2 rounded-lg transition-all flex-shrink-0 ${activeLeftTab === tab.id ? 'bg-base-100 shadow-sm text-primary' : 'text-base-content/60 hover:text-base-content'
                  }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            {activeLeftTab === 'description' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">{problem.title}</h1>
                </div>

                <div className="flex gap-2 mb-8">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-base-200 text-base-content/70 border border-base-300">
                    {problem.tags}
                  </span>
                </div>

                <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-base-content prose-p:text-base-content/80">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {problem.descripton}
                  </div>
                </div>

                <div className="mt-10 space-y-6">
                  {problem.visibleTestCase.map((example, index) => (
                    <div key={index} className="card bg-base-200/50 border border-base-300 shadow-sm overflow-hidden">
                      <div className="bg-base-300/30 px-4 py-2 border-b border-base-300">
                        <h4 className="font-semibold text-sm opacity-70">Example {index + 1}</h4>
                      </div>
                      <div className="p-4 space-y-3 font-mono text-sm">
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                          <span className="opacity-50 select-none">Input:</span>
                          <span className="text-base-content">{example.input}</span>
                        </div>
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                          <span className="opacity-50 select-none">Output:</span>
                          <span className="text-base-content font-semibold">{example.output}</span>
                        </div>
                        {example.explanation && (
                          <div className="grid grid-cols-[80px_1fr] gap-2">
                            <span className="opacity-50 select-none">Explain:</span>
                            <span className="text-base-content/80 font-sans italic">{example.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeLeftTab === 'editorial' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">Editorial</h2>
                {problem.isPremiumAccess ? (
                  <div className="alert bg-base-200/50 border border-base-300">
                    <div className="w-full">
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                    </div>
                  </div>
                ) : (
                  <LockedContent
                    title="Editorial Locked"
                    description="Unlock premium access to watch the video editorial for this problem."
                  />
                )}
              </div>
            )}

            {activeLeftTab === 'solutions' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Code2 size={24} className="text-primary" /> Reference Solutions
                </h2>
                {problem.isPremiumAccess ? (
                  <div className="space-y-6">
                    {problem.refrenceSolution?.map((solution, index) => (
                      <div key={index} className="mockup-code bg-[#1e1e1e] border border-base-300 shadow-lg text-sm">
                        <div className="flex justify-between items-center px-4 -mt-2 mb-4">
                          <span className="badge badge-primary badge-outline text-xs">{solution?.language}</span>
                        </div>
                        <pre><code>{solution?.completeCode}</code></pre>
                      </div>
                    )) || (
                        <div className="text-center py-10 opacity-50 border-2 border-dashed border-base-300 rounded-xl">
                          <Code2 size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No reference solutions available yet.</p>
                        </div>
                      )}
                  </div>
                ) : (
                  <LockedContent
                    title="Solution Locked"
                    description="Upgrade to Premium to view the reference solution code for this problem."
                  />
                )}
              </div>
            )}

            {activeLeftTab === 'submissions' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">My Submissions</h2>
                <SubmissionHistory problemId={problemId} />
              </div>
            )}

            {activeLeftTab === 'chatAI' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                <div className="flex-1">
                  <ChatAi problem={problem} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-[#1e1e1e] relative order-1 md:order-2 border-b md:border-b-0 md:border-l border-[#333]">
          {/* Editor Header */}
          <div className="flex justify-between items-center bg-[#1e1e1e] border-b border-[#333] p-2 px-4 shadow-sm z-10 basis-12 flex-none">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Code2 size={16} />
                <span>Code</span>
              </div>
              <select
                className="select select-ghost select-sm w-36 bg-[#2d2d2d] text-gray-200 border-none focus:outline-none focus:bg-[#333]"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-xs text-gray-400 hover:text-white"
                onClick={() => {
                  const selectedLang = langMap[selectedLanguage];
                  const foundCode = problem.startCode.find(sc => sc.language === selectedLang);
                  const initialCode = foundCode ? foundCode.intialCode : '// Write your code here';
                  setCode(initialCode);
                }}
                title="Reset Code"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 relative group">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                automaticLayout: true,
                message: { enabled: false },
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'line',
                cursorSmoothCaretAnimation: true,
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Results Panel Container - Absolute Overlay */}
          <div className={`absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out border-t border-[#333] bg-[#1e1e1e] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50 flex flex-col ${activeRightTab === 'testcase' || activeRightTab === 'result' ? 'h-[450px]' : 'h-10'
            }`}>
            <div
              className="flex items-center gap-2 bg-[#252526] p-2 px-3 border-b border-[#333] cursor-pointer hover:bg-[#2d2d2d] transition-colors"
              onClick={() => setActiveRightTab(prev => (prev === 'testcase' || prev === 'result') ? 'code' : 'testcase')}
            >
              <div className={`p-1 rounded ${activeRightTab === 'testcase' || activeRightTab === 'result' ? 'text-primary' : 'text-gray-400'}`}>
                <CheckCircle size={16} />
              </div>
              <span className="text-sm font-medium text-gray-300">Test Results</span>

              <div className="ml-auto">
                {activeRightTab === 'testcase' || activeRightTab === 'result' ?
                  <span className="text-xs text-gray-500">Click to collapse</span> :
                  <span className="text-xs text-gray-500">Click to expand</span>
                }
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e] text-gray-300 relative">
              {/* Loading State */}
              {(isRunning || isSubmitting) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e]/80 backdrop-blur-sm z-20">
                  <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                  <span className="text-base font-medium animate-pulse">Running Code...</span>
                </div>
              )}

              {/* Empty State / Prompt */}
              {!isRunning && !isSubmitting && !runResult && !submitResult && (activeRightTab === 'testcase' || activeRightTab === 'result') && (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <Play size={48} className="mb-4" strokeWidth={1} />
                  <p className="text-lg font-light">Run your code to see the output here</p>
                </div>
              )}

              {/* Run Results */}
              {activeRightTab === 'testcase' && runResult && !isRunning && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`p-4 rounded-xl border mb-6 flex items-center justify-between shadow-sm ${runResult.success ? 'bg-green-900/10 border-green-800/40 text-green-400' : 'bg-red-900/10 border-red-800/40 text-red-400'}`}>
                    <h3 className="font-bold text-lg flex items-center gap-3">
                      {runResult.success ? <CheckCircle size={24} /> : <XCircle size={24} />}
                      {runResult.success ? 'All Test Cases Passed' : 'Test Failed'}
                    </h3>
                    {runResult.success && (
                      <div className="text-sm font-mono flex gap-4 opacity-80">
                        <span className="flex items-center gap-1">⏱️ {runResult.runtime}s</span>
                        <span className="flex items-center gap-1">💾 {runResult.memory}KB</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {runResult.testCases.map((tc, i) => (
                      <div key={i} className={`p-4 bg-[#252526] rounded-xl border transition-all ${tc.status_id === 3 ? 'border-[#333] hover:border-green-500/30' : 'border-red-900/30 hover:border-red-500/30'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs uppercase font-bold tracking-widest opacity-40">Case {i + 1}</span>
                          <span className={`badge badge-sm font-mono ${tc.status_id === 3 ? 'badge-success badge-outline' : 'badge-error badge-outline'}`}>
                            {tc.status_id === 3 ? 'ACCEPTED' : 'WRONG ANSWER'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                          <div className="space-y-1">
                            <div className="text-gray-500 font-semibold">Input</div>
                            <div className="bg-[#1e1e1e] p-3 rounded-lg border border-[#333] overflow-x-auto text-gray-300">{safeDecode(tc.stdin)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-500 font-semibold">Expected</div>
                            <div className="bg-[#1e1e1e] p-3 rounded-lg border border-[#333] overflow-x-auto text-green-400/80">{safeDecode(tc.expected_output)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-gray-500 font-semibold">Output</div>
                            <div className={`bg-[#1e1e1e] p-3 rounded-lg border border-[#333] overflow-x-auto ${tc.status_id !== 3 ? 'text-red-400' : 'text-gray-300'}`}>
                              {safeDecode(tc.stdout)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Results */}
              {activeRightTab === 'result' && submitResult && !isSubmitting && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`p-8 rounded-2xl border mb-6 text-center shadow-lg ${submitResult.accepted ? 'bg-gradient-to-br from-green-900/20 to-transparent border-green-800/40' : 'bg-gradient-to-br from-red-900/20 to-transparent border-red-800/40'}`}>
                    {submitResult.accepted ? (
                      <>
                        <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-6 ring-1 ring-green-500/30">
                          <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Accepted</h2>
                        <p className="text-green-400/80 mb-8 font-medium">Congratulations! You have solved this problem.</p>

                        <div className="flex justify-center gap-4 md:gap-12">
                          <div className="text-center p-4 bg-[#252526] rounded-xl border border-[#333] min-w-[120px]">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Runtime</div>
                            <div className="text-2xl font-mono font-bold text-white">{submitResult.runtime}<span className="text-sm text-gray-500 ml-1">s</span></div>
                          </div>
                          <div className="text-center p-4 bg-[#252526] rounded-xl border border-[#333] min-w-[120px]">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Memory</div>
                            <div className="text-2xl font-mono font-bold text-white">{submitResult.memory}<span className="text-sm text-gray-500 ml-1">KB</span></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/30">
                          <XCircle size={48} className="text-red-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Wrong Answer</h2>
                        <p className="text-red-400/80 mb-6">{submitResult.error}</p>

                        {submitResult.stdout && (
                          <div className="bg-[#151515] p-4 rounded-xl border border-red-900/30 text-left">
                            <div className="text-xs text-gray-500 uppercase mb-2">Error Output</div>
                            <pre className="font-mono text-sm text-red-300 whitespace-pre-wrap">{safeDecode(submitResult.stdout)}</pre>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;