import React, { useState } from 'react';
import { BirthdayConfig, MemorySection, MediaType } from '../types';
import {
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Check,
  HelpCircle,
  Code,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface StoryManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (newConfig: BirthdayConfig) => void;
  onResetToDefault: () => void;
}

export const StoryManagerDrawer: React.FC<StoryManagerDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'export' | 'help'>('sections');
  const [draftConfig, setDraftConfig] = useState<BirthdayConfig>(config);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync draft when config changes or drawer opens
  React.useEffect(() => {
    setDraftConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleUpdateSection = (index: number, field: keyof MemorySection, value: any) => {
    const updatedSections = [...draftConfig.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    setDraftConfig({
      ...draftConfig,
      sections: updatedSections,
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= draftConfig.sections.length) return;

    const updatedSections = [...draftConfig.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[targetIndex];
    updatedSections[targetIndex] = temp;

    // Recalculate order
    const reordered = updatedSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setDraftConfig({ ...draftConfig, sections: reordered });
  };

  const handleAddSection = () => {
    const newSection: MemorySection = {
      id: `memory-${Date.now()}`,
      order: draftConfig.sections.length + 1,
      heading: 'New Name or Memory',
      message: '[Write your personal message here.]',
      mediaType: 'image',
      mediaUrl: '',
      caption: '',
      dateOrPlace: '',
    };
    setDraftConfig({
      ...draftConfig,
      sections: [...draftConfig.sections, newSection],
    });
  };

  const handleDeleteSection = (index: number) => {
    if (draftConfig.sections.length <= 1) {
      alert('You should have at least one memory section.');
      return;
    }
    const updatedSections = draftConfig.sections
      .filter((_, idx) => idx !== index)
      .map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setDraftConfig({ ...draftConfig, sections: updatedSections });
  };

  const handleApplyChanges = () => {
    onSaveConfig(draftConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const jsonExport = JSON.stringify(draftConfig, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F1926]/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#FAF7F5] h-full shadow-2xl flex flex-col border-l border-[#E3D7E5] overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E8DEE8] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#3B2C4E]">
              Personal Story &amp; Content Manager
            </h3>
            <p className="text-xs text-[#7F708E]">
              Manage memory sections, Google Drive links, and personal messages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF5FA] hover:bg-[#F2E7F3] text-[#554665] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8DEE8] bg-[#F7F2F6] px-6">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'sections'
                ? 'border-[#5A3F74] text-[#5A3F74] bg-white font-semibold'
                : 'border-transparent text-[#766785] hover:text-[#3B2C4E]'
            }`}
          >
            Memory Sections ({draftConfig.sections.length})
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-[#5A3F74] text-[#5A3F74] bg-white font-semibold'
                : 'border-transparent text-[#766785] hover:text-[#3B2C4E]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export Config / JSON</span>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'help'
                ? 'border-[#5A3F74] text-[#5A3F74] bg-white font-semibold'
                : 'border-transparent text-[#766785] hover:text-[#3B2C4E]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Google Drive Helper</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'sections' && (
            <div className="space-y-6">
              {/* General Recipient Info */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFD8] space-y-3">
                <h4 className="font-serif font-medium text-sm text-[#4E3E5D]">
                  Recipient Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#7A6B88] block mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={draftConfig.recipientName}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, recipientName: e.target.value })
                      }
                      className="w-full text-xs p-2 rounded-lg border border-[#DDD3E2] bg-[#FAF8FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8E6E9E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#7A6B88] block mb-1">
                      Nicknames (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.recipientNicknames.join(', ')}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          recipientNicknames: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full text-xs p-2 rounded-lg border border-[#DDD3E2] bg-[#FAF8FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8E6E9E]"
                    />
                  </div>
                </div>
              </div>

              {/* Sections List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-medium text-sm text-[#4E3E5D]">
                    Memory Sections (Strict Sequence: Media → Heading → Message)
                  </h4>
                  <button
                    onClick={handleAddSection}
                    className="flex items-center gap-1.5 text-xs text-[#5D4277] bg-[#F3EBF7] px-3 py-1.5 rounded-xl hover:bg-[#EBDFF3] transition-colors font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {draftConfig.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="bg-white p-5 rounded-2xl border border-[#E5DBE8] shadow-2xs space-y-3"
                  >
                    {/* Header bar of section card */}
                    <div className="flex items-center justify-between border-b border-[#F2EBF5] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#EFE8F5] text-[#55406C] text-xs font-semibold flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <span className="text-xs font-medium text-[#503E64]">
                          {section.heading || 'Untitled Section'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveSection(index, 'up')}
                          className="p-1 text-[#7B6E88] hover:text-[#3B2C4E] disabled:opacity-30 rounded hover:bg-[#F6EEF8]"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === draftConfig.sections.length - 1}
                          onClick={() => handleMoveSection(index, 'down')}
                          className="p-1 text-[#7B6E88] hover:text-[#3B2C4E] disabled:opacity-30 rounded hover:bg-[#F6EEF8]"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(index)}
                          className="p-1 text-[#BA6377] hover:text-[#9B384E] rounded hover:bg-[#FDF0F3]"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Step 1: Media Configuration */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-[#6E5D7D]">
                          1. Media (Photograph or Video)
                        </label>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`mediaType-${section.id}`}
                              checked={section.mediaType === 'image'}
                              onChange={() => handleUpdateSection(index, 'mediaType', 'image')}
                              className="accent-[#6B4B87]"
                            />
                            <span className="text-[11px] text-[#5E516D]">Photo</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`mediaType-${section.id}`}
                              checked={section.mediaType === 'video'}
                              onChange={() => handleUpdateSection(index, 'mediaType', 'video')}
                              className="accent-[#6B4B87]"
                            />
                            <span className="text-[11px] text-[#5E516D]">Video</span>
                          </label>
                        </div>
                      </div>
                      <input
                        type="url"
                        value={section.mediaUrl}
                        onChange={(e) => handleUpdateSection(index, 'mediaUrl', e.target.value)}
                        placeholder={
                          section.mediaType === 'image'
                            ? 'Google Drive image link or direct photo URL'
                            : 'Google Drive video link or direct video URL'
                        }
                        className="w-full text-xs p-2 rounded-lg border border-[#DDD3E2] bg-[#FAF8FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8E6E9E]"
                      />
                    </div>

                    {/* Optional Caption & Date/Place */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={section.caption || ''}
                        onChange={(e) => handleUpdateSection(index, 'caption', e.target.value)}
                        placeholder="Optional caption beneath photo"
                        className="text-xs p-1.5 rounded-lg border border-[#E2D8E6] bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={section.dateOrPlace || ''}
                        onChange={(e) => handleUpdateSection(index, 'dateOrPlace', e.target.value)}
                        placeholder="Optional date or location"
                        className="text-xs p-1.5 rounded-lg border border-[#E2D8E6] bg-white focus:outline-none"
                      />
                    </div>

                    {/* Step 2: Heading */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5D7D] block mb-1">
                        2. Heading (Her Name or Nickname)
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleUpdateSection(index, 'heading', e.target.value)}
                        placeholder="e.g. Her Name, Little Star, Doremi..."
                        className="w-full text-xs font-serif p-2 rounded-lg border border-[#DDD3E2] bg-[#FAF8FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8E6E9E]"
                      />
                    </div>

                    {/* Step 3: Message */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5D7D] block mb-1">
                        3. Your Written Personal Message
                      </label>
                      <textarea
                        rows={4}
                        value={section.message}
                        onChange={(e) => handleUpdateSection(index, 'message', e.target.value)}
                        placeholder="Write your genuine personal message here..."
                        className="w-full text-xs font-sans leading-relaxed p-2.5 rounded-lg border border-[#DDD3E2] bg-[#FAF8FB] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8E6E9E]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-[#FAF5F2] border border-[#E9DFD8] p-4 rounded-xl text-xs text-[#6B5A79] leading-relaxed">
                <strong>Clean Configuration Backup:</strong> You can copy this JSON configuration and paste it directly into <code className="font-mono text-[#523A68]">src/data/birthdayContent.ts</code> so your content remains permanent across all environments.
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={14}
                  value={jsonExport}
                  className="w-full font-mono text-[11px] p-3 rounded-xl border border-[#DDD3E2] bg-white text-[#382B48] focus:outline-none"
                />
                <button
                  onClick={handleCopyJson}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-[#5D4277] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-[#4E3466] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-4 text-xs text-[#524462] leading-relaxed">
              <div className="bg-white p-5 rounded-2xl border border-[#E2D5E5] space-y-3">
                <h4 className="font-serif font-semibold text-sm text-[#3E2D50]">
                  How to use Google Drive Photos &amp; Videos
                </h4>
                <ol className="list-decimal pl-4 space-y-2 text-[#5E516F]">
                  <li>
                    Upload your photograph or video to your personal <strong>Google Drive</strong>.
                  </li>
                  <li>
                    Right-click the file and select <strong>Share → Share</strong>.
                  </li>
                  <li>
                    Under <em>General access</em>, change from <strong>Restricted</strong> to{' '}
                    <strong className="text-[#4E2E69]">"Anyone with the link"</strong> with role <strong>Viewer</strong>.
                  </li>
                  <li>
                    Click <strong>Copy link</strong> (e.g.{' '}
                    <code className="text-[#785390] bg-[#FAF4FB] px-1 py-0.5 rounded">
                      https://drive.google.com/file/d/1A2B3C.../view?usp=sharing
                    </code>
                    ).
                  </li>
                  <li>
                    Paste that link directly into the <strong>Media URL</strong> field. The website automatically extracts the file ID and embeds it cleanly!
                  </li>
                </ol>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2D5E5] space-y-2">
                <h4 className="font-serif font-semibold text-sm text-[#3E2D50]">
                  A Note on Google Photos
                </h4>
                <p className="text-[#645574]">
                  Google Photos share links (e.g. <code className="bg-[#FAF4FB] px-1 rounded">photos.app.goo.gl</code>) lead to web albums rather than raw image files. For the most reliable experience, we recommend uploading those memories to Google Drive or copying the direct image address.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-white border-t border-[#E8DEE8] flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset content back to original placeholders?')) {
                onResetToDefault();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-[#8A7997] hover:text-[#533F67]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#655577] bg-[#F7F2F8] rounded-xl hover:bg-[#EEE5F0]"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#553C6E] rounded-xl hover:bg-[#462F5C] shadow-xs"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Saved!' : 'Save & Update Live'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
