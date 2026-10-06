import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Terminal, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { FLUTTER_MAIN_DART_CODE } from '../flutterCode';

interface FlutterCodeViewerProps {
  onClose?: () => void;
}

export const FlutterCodeViewer: React.FC<FlutterCodeViewerProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  const handleCopy = () => {
    navigator.clipboard.writeText(FLUTTER_MAIN_DART_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([FLUTTER_MAIN_DART_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.dart';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = FLUTTER_MAIN_DART_CODE.split('\n');

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-text">
      {/* Top Code Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#FF9933]" />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>lib/main.dart</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-500/30">
                  Flutter 3.x • Material 3
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Single-file production-ready Flutter app • Live GPS Ride Tracking • Admin Earnings Chart • 6 Services
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs mr-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`py-1 px-2.5 rounded-md font-medium transition-colors ${
                activeTab === 'code' ? 'bg-[#FF9933] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dart Code ({lines.length} lines)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-1 px-2.5 rounded-md font-medium transition-colors ${
                activeTab === 'guide' ? 'bg-[#FF9933] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Build & Run Guide
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-1.5 px-3 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span> main.dart
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'code' ? (
          <div className="p-4 font-mono text-xs leading-relaxed text-slate-300">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isComment = line.trim().startsWith('//') || line.trim().startsWith('///');
                    const isKeyword =
                      line.includes('class ') ||
                      line.includes('void ') ||
                      line.includes('import ') ||
                      line.includes('return ') ||
                      line.includes('const ') ||
                      line.includes('final ');

                    return (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="w-12 select-none text-right pr-4 text-slate-600 font-mono text-[11px] align-top">
                          {lineNum}
                        </td>
                        <td
                          className={`whitespace-pre font-mono ${
                            isComment
                              ? 'text-emerald-500'
                              : isKeyword
                              ? 'text-amber-300'
                              : 'text-slate-200'
                          }`}
                        >
                          {line}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 max-w-3xl mx-auto space-y-6 text-slate-300 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#FF9933]" />
                <span>How to Build & Run this Flutter App</span>
              </h3>
              <p className="text-slate-400">
                You can directly paste this single-file code into any standard Flutter project. No third-party packages required!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm mb-1.5">Step 1: Create a Flutter project</h4>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300">
                  flutter create bharat_mitra<br />
                  cd bharat_mitra
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1.5">Step 2: Replace lib/main.dart</h4>
                <p className="text-slate-400 mb-2">
                  Replace the default contents of <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded">lib/main.dart</code> with the provided code.
                </p>
                <button
                  onClick={handleCopy}
                  className="py-1.5 px-3 bg-[#FF9933] hover:bg-[#ff8819] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy lib/main.dart</span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1.5">Step 3: Run on Device or Emulator</h4>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                  flutter run
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1.5">Step 4: Build Release Android APK</h4>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-blue-400">
                  flutter build apk --release
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  The generated APK will be at: <code className="text-slate-300">build/app/outputs/flutter-apk/app-release.apk</code>
                </p>
              </div>

              {/* Secret 7-Second Feature Documentation */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF9933]" />
                  <h4 className="font-bold text-amber-200 text-sm">
                    Exact 7-Second Secret Admin Gesture Implementation:
                  </h4>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  In <code className="text-amber-300">SplashScreen</code>, we use a <code className="text-amber-300">Listener</code> widget wrapping the logo.
                  On <code className="text-amber-300">onPointerDown</code>, a silent Dart <code className="text-amber-300">Timer(const Duration(seconds: 7), () &#123; ... &#125;)</code> is instantiated without showing any countdown or progress bar.
                  If held continuously for 7 seconds, it redirects silently to <code className="text-amber-300">AdminPanelScreen</code>.
                  If released before 7 seconds, the timer cancels immediately. Normal taps navigate to <code className="text-amber-300">HomeScreen</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
