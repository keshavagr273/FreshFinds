import React, { useState } from 'react';

const FreshnessAnalyzer = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult({
        freshness: 85,
        status: 'Fresh',
        recommendations: [
          'Store in refrigerator to maintain freshness',
          'Consume within 3-5 days',
          'Check for any soft spots before consuming'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
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
                      ☁️📤
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
                      className="max-w-md mx-auto mb-4 rounded-lg shadow-md"
                    />
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Freshness'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setAnalysisResult(null);
                        }}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Upload New Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {analysisResult && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Freshness Score</h3>
                        <span className="text-2xl font-bold text-emerald-600">
                          {analysisResult.freshness}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${analysisResult.freshness}%` }}
                        ></div>
                      </div>
                      <p className="text-emerald-700 font-medium mt-2">
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