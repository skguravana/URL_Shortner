import { useState } from "react";
import axios from "axios";
import { Link, BarChart3, Clock, MousePointer, Copy, CheckCircle } from "lucide-react";

function App() {
  const [longurl, setLongurl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [expiry, setExpiry] = useState(3600);
  const [shorturl, setShorturl] = useState(null);
  const [stats, setStats] = useState(null);
  const [statCode, setStatCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Create Short URL
  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/shorty/shorten", {
        longurl,
        shortcode: shortcode || undefined,
        expiryInSeconds: expiry,
      });
      setShorturl(res.data.shorturl);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating shorturl");
    }
  };

  // Fetch Stats
  const handleStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/shorty/stats/${statCode}`
      );
      setStats(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching stats");
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (shorturl) {
      await navigator.clipboard.writeText(shorturl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
              <Link className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Shorty</h1>
              <p className="text-orange-600 font-medium">
                Professional URL Shortener
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Shorten Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Link size={24} />
                <span>Create Short URL</span>
              </h2>
              <p className="text-orange-100 mt-1">
                Transform your long URLs into short, shareable links
              </p>
            </div>

            <div className="p-8">
              <form onSubmit={handleShorten} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Long URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={longurl}
                    onChange={(e) => setLongurl(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Shortcode (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="my-custom-link"
                    value={shortcode}
                    onChange={(e) => setShortcode(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2  items-center space-x-2">
                    <Clock size={16} />
                    <span>Expiry Time (seconds)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="3600"
                    value={expiry}
                    onChange={(e) => setExpiry(Number(e.target.value))}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200"
                    min="1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Generate Short URL
                </button>
              </form>

              {/* Show Short URL */}
              {shorturl && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="font-bold text-green-800">
                      Success! Your short URL is ready
                    </span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-green-200">
                    <a
                      href={shorturl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex-1 truncate"
                    >
                      {shorturl}
                    </a>
                    <button
                      onClick={handleCopy}
                      className="ml-3 p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                      title="Copy to clipboard"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <BarChart3 size={24} />
                <span>Analytics</span>
              </h2>
              <p className="text-orange-100 mt-1">
                Track clicks and performance metrics
              </p>
            </div>

            <div className="p-8">
              <div className="flex space-x-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter shortcode"
                  value={statCode}
                  onChange={(e) => setStatCode(e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200"
                />
                <button
                  onClick={handleStats}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Get Stats
                </button>
              </div>

              {/* Stats Result */}
              {stats && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link className="text-orange-500" size={16} />
                        <span className="font-semibold text-gray-700">
                          Original URL
                        </span>
                      </div>
                      <a
                        href={stats.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 hover:text-orange-700 transition-colors break-all text-sm"
                      >
                        {stats.url}
                      </a>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <MousePointer className="text-orange-500" size={16} />
                        <span className="font-semibold text-gray-700">
                          Total Clicks
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.clicks}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="text-green-500" size={16} />
                          <span className="font-semibold text-gray-700 text-sm">
                            Created
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(stats.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(stats.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="text-red-500" size={16} />
                          <span className="font-semibold text-gray-700 text-sm">
                            Expires
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(stats.expiresAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(stats.expiresAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-orange-100 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600">Thanks For using Shortly</p>
        </div>
      </div>
    </div>
  );
}

export default App;
