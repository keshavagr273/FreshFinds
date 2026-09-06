import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const FreshnessAnalyzer = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusNotice, setStatusNotice] = useState(null);
  const [modelStatus, setModelStatus] = useState({
    stage: 'CHECKING',
    isReady: false,
    isSleeping: false,
    isWaking: false,
    estimatedSeconds: 0,
    message: 'Checking AI engine status...'
  });
  const [wakeCountdown, setWakeCountdown] = useState(0);
  const [queuedFile, setQueuedFile] = useState(null);
  const objectUrlRef = useRef(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // Format status enum to human-friendly text
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Check the Hugging Face Space runtime stage
  const checkModelStatus = useCallback(async (wake = true) => {
    try {
      const res = await axios.get(`${baseURL}/freshness/status?wake=${wake}`);
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setModelStatus(data);

        if (data.isSleeping || data.isWaking) {
          setWakeCountdown((prev) => (prev > 0 ? prev : data.estimatedSeconds || 35));
        } else if (data.isReady) {
          setWakeCountdown(0);
          setStatusNotice(null);
        }
        return data;
      }
    } catch (err) {
      console.warn('AI status check probe failed:', err.message);
    }
    return null;
  }, [baseURL]);

  // Initial status probe on mount (triggers wake-up if sleeping)
  useEffect(() => {
    checkModelStatus(true);
  }, [checkModelStatus]);

  // Real-time countdown timer for model wake-up
  useEffect(() => {
    if (wakeCountdown <= 0) return;

    const timer = setInterval(() => {
      setWakeCountdown((prev) => {
        if (prev <= 1) {
          checkModelStatus(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [wakeCountdown, checkModelStatus]);

  // Poll status while the space is booting up
  useEffect(() => {
    if (modelStatus.isReady) return;

    const pollInterval = setInterval(async () => {
      const latest = await checkModelStatus(false);
      if (latest?.isReady && queuedFile) {
        // Automatically process queued image once awake
        analyzeFile(queuedFile);
        setQueuedFile(null);
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [modelStatus.isReady, queuedFile, checkModelStatus]);

  const analyzeFile = async (file) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in first to use the AI Freshness Analyzer.');
      return;
    }

    // If the model is currently waking up, queue the file and inform the user
    if (!modelStatus.isReady && (modelStatus.isSleeping || modelStatus.isWaking)) {
      setQueuedFile(file);
      setIsAnalyzing(true);
      setErrorMessage('');
      setStatusNotice({
        type: 'waking',
        title: '🌱 AI Engine Warming Up',
        message: `The AI service was sleeping due to inactivity. We are waking it up (~${wakeCountdown || 30}s). Your produce photo is queued and will analyze automatically!`
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsAnalyzing(true);
    setErrorMessage('');
    setStatusNotice(null);

    try {
      const response = await axios.post(`${baseURL}/freshness/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const results = response.data?.data?.analysisResults;
      if (!results) {
        throw new Error('Freshness API returned an unexpected response format.');
      }

      setAnalysisResult({
        freshness: results.freshnessScore,
        status: formatStatus(results.status),
        recommendations: Array.isArray(results.recommendations) ? results.recommendations : []
      });
      setStatusNotice(null);
      setQueuedFile(null);
    } catch (error) {
      const errorData = error.response?.data;

      // Handle eco-sleep / cold start response gracefully
      if (errorData?.isSleeping || errorData?.isWaking || error.response?.status === 503) {
        const remaining = errorData?.estimatedSeconds || 35;
        setWakeCountdown(remaining);
        setModelStatus((prev) => ({
          ...prev,
          isReady: false,
          isWaking: true,
          isSleeping: true,
          stage: errorData?.stage || 'APP_STARTING'
        }));
        setQueuedFile(file);
        setStatusNotice({
          type: 'waking',
          title: '🌱 Neural Network Warming Up',
          message: `The AI analyzer is waking up from eco-sleep mode (~${remaining}s). We've initiated the boot sequence—your produce will analyze automatically!`
        });
        setErrorMessage('');
      } else {
        const message = errorData?.message || error.message || 'Failed to analyze image';
        setErrorMessage(message);
        setStatusNotice(null);
        setQueuedFile(null);
      }
    } finally {
      if (!queuedFile) {
        setIsAnalyzing(false);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      // Clean up previous URL object
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = previewUrl;

      setSelectedFile(file);
      setSelectedImage(previewUrl);
      setAnalysisResult(null);
      setErrorMessage('');
      analyzeFile(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    await analyzeFile(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                AI-Powered Produce Freshness Analysis
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload a clear photo of your fruits or vegetables for instant deep-learning freshness grading, shelf-life estimation, and storage guidance.
              </p>
            </div>

            {/* AI Engine Status Pill */}
            <div className="flex justify-center mb-6">
              {modelStatus.isReady ? (
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>AI Freshness Engine: <strong>Online & Ready</strong></span>
                </div>
              ) : modelStatus.isSleeping || modelStatus.isWaking || wakeCountdown > 0 ? (
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium px-4 py-1.5 rounded-full shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>AI Engine: <strong>Waking Up (~{wakeCountdown || 30}s)</strong></span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                  <span>AI Engine: <strong>Connecting...</strong></span>
                </div>
              )}
            </div>

            {/* Graceful Wake-up Notification Banner */}
            {(modelStatus.isSleeping || modelStatus.isWaking || statusNotice?.type === 'waking' || wakeCountdown > 0) && !modelStatus.isReady && (
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 rounded-2xl p-6 mb-8 text-left shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
                    🌱
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-bold text-amber-950 text-lg">
                        {statusNotice?.title || 'AI Engine is Waking Up from Eco-Sleep Mode'}
                      </h3>
                      <span className="bg-amber-200 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        {wakeCountdown > 0 ? `Ready in ~${wakeCountdown}s` : 'Booting Weights...'}
                      </span>
                    </div>
                    <p className="text-sm text-amber-900 mt-2 leading-relaxed">
                      {statusNotice?.message ||
                        'Hugging Face automatically puts free deep-learning containers to sleep after inactivity to conserve energy. We have initiated the automatic boot sequence. Feel free to upload your produce photo now—the system will process it automatically as soon as the model is live!'}
                    </p>

                    {/* Dynamic Countdown Progress Bar */}
                    <div className="w-full bg-amber-200 rounded-full h-2.5 mt-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(100, Math.max(12, 100 - (wakeCountdown / 45) * 100))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-10 text-center hover:border-purple-400 transition-colors">
                {!selectedImage ? (
                  <div>
                    <span className="text-6xl text-purple-400 mb-4 block">
                      📸
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Upload Produce Image
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Select a clear photo of your fruits or vegetables. Our AI inspects color, texture, and surface features to grade freshness.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold cursor-pointer hover:bg-purple-700 transition-all shadow-md inline-block"
                    >
                      Choose Produce Photo
                    </label>
                  </div>
                ) : (
                  <div>
                    <img
                      src={selectedImage}
                      alt="Selected produce"
                      className="w-full max-w-md max-h-80 mx-auto mb-6 rounded-xl shadow-md object-contain border border-gray-100"
                    />

                    {isAnalyzing ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent mb-3"></div>
                        <p className="text-purple-700 font-semibold text-lg">
                          {queuedFile || (!modelStatus.isReady && wakeCountdown > 0)
                            ? `🌱 Neural network warming up (~${wakeCountdown}s)... Analysis starts automatically!`
                            : 'Analyzing produce quality and texture...'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Running hybrid feature extraction & neural classification
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                        <button
                          onClick={analyzeImage}
                          className="bg-purple-600 text-white px-7 py-3 rounded-xl font-medium hover:bg-purple-700 transition-all shadow-sm"
                        >
                          Re-analyze Freshness
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedFile(null);
                            setQueuedFile(null);
                            setAnalysisResult(null);
                            setErrorMessage('');
                            setStatusNotice(null);
                          }}
                          className="bg-gray-100 text-gray-700 px-7 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                        >
                          Upload Different Image
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Standard Error Notice */}
              {errorMessage && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center font-medium">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Analysis Results Section */}
            {analysisResult && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Analysis Results
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div
                      className={`rounded-2xl p-6 ${
                        analysisResult.freshness >= 70
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                          : analysisResult.freshness >= 40
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                          : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Freshness Score
                        </h3>
                        <span
                          className={`text-3xl font-extrabold ${
                            analysisResult.freshness >= 70
                              ? 'text-emerald-600'
                              : analysisResult.freshness >= 40
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {analysisResult.freshness}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3.5 overflow-hidden">
                        <div
                          className={`h-3.5 rounded-full transition-all duration-700 ${
                            analysisResult.freshness >= 70
                              ? 'bg-emerald-500'
                              : analysisResult.freshness >= 40
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${analysisResult.freshness}%` }}
                        ></div>
                      </div>

                      <p
                        className={`font-semibold text-base mt-3 ${
                          analysisResult.freshness >= 70
                            ? 'text-emerald-800'
                            : analysisResult.freshness >= 40
                            ? 'text-yellow-800'
                            : 'text-red-800'
                        }`}
                      >
                        Quality Tier: {analysisResult.status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Storage & Consumption Guidance
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                          <span className="text-purple-600 text-base shrink-0 mt-0.5">
                            ✅
                          </span>
                          <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreshnessAnalyzer;