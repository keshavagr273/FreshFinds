import React, { useState } from 'react';
import axios from 'axios';

const FreshnessAnalyzer = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const analyzeFile = async (file) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please login first to use freshness analysis.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${baseURL}/freshness/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const results = response.data?.data?.analysisResults;
      if (!results) {
        throw new Error('Freshness API returned an unexpected response.');
      }

      setAnalysisResult({
        freshness: results.freshnessScore,
        status: formatStatus(results.status),
        recommendations: Array.isArray(results.recommendations) ? results.recommendations : []
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to analyze image';
      setErrorMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setSelectedFile(file);
      setSelectedImage(previewUrl);
      setAnalysisResult(null);
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
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Freshness Analysis
              </h1>
              <p className="text-xl text-gray-600">
                Upload an image of your produce to get instant freshness insights
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center">
                {!selectedImage ? (
                  <div>
                    <span className="text-6xl text-purple-400 mb-4 block">
                      Upload
                    </span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Upload Produce Image
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Select a clear image of your fruits or vegetables
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
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-purple-700 transition-colors inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div>
                    <img
                      src={selectedImage}
                      alt="Selected produce"
                      className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-md object-contain"
                    />
                    {isAnalyzing ? (
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-purple-600 font-medium">Analyzing your produce...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={analyzeImage}
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                          Re-analyze Freshness
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setSelectedFile(null);
                            setAnalysisResult(null);
                            setErrorMessage('');
                          }}
                          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                        >
                          Upload New Image
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errorMessage && (
                <p className="mt-4 text-red-600 font-medium text-center">{errorMessage}</p>
              )}
            </div>

            {/* Results Section */}
            {analysisResult && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className={`rounded-xl p-6 ${analysisResult.freshness >= 70 ? 'bg-gradient-to-r from-green-50 to-emerald-50' :
                      analysisResult.freshness >= 40 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
                        analysisResult.freshness >= 20 ? 'bg-gradient-to-r from-orange-50 to-red-50' :
                          'bg-gradient-to-r from-red-50 to-red-100'
                      }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Freshness Score</h3>
                        <span className={`text-2xl font-bold ${analysisResult.freshness >= 70 ? 'text-emerald-600' :
                          analysisResult.freshness >= 40 ? 'text-yellow-600' :
                            analysisResult.freshness >= 20 ? 'text-orange-600' :
                              'text-red-600'
                          }`}>
                          {analysisResult.freshness}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${analysisResult.freshness >= 70 ? 'bg-emerald-500' :
                            analysisResult.freshness >= 40 ? 'bg-yellow-500' :
                              analysisResult.freshness >= 20 ? 'bg-orange-500' :
                                'bg-red-500'
                            }`}
                          style={{ width: `${analysisResult.freshness}%` }}
                        ></div>
                      </div>
                      <p className={`font-medium mt-2 ${analysisResult.freshness >= 70 ? 'text-emerald-700' :
                        analysisResult.freshness >= 40 ? 'text-yellow-700' :
                          analysisResult.freshness >= 20 ? 'text-orange-700' :
                            'text-red-700'
                        }`}>
                        Status: {analysisResult.status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
                    <ul className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-purple-600 text-sm mt-0.5">
                            ✅
                          </span>
                          <span className="text-gray-700">{rec}</span>
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