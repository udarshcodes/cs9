import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock3,
  Loader,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Eye,
  Minus,
} from 'lucide-react'
import Button from '../../../../components/Button/Button'
import Input from '../../../../components/Input/Input'
import Select from '../../../../components/Select/Select'
import Modal from '../../../../components/Modal/Modal'
import { notifyError, notifySuccess } from '../../../../lib/notify'
import { fetchAdminSettings, updateAdminSettingsSection, previewLeaderboardWeights } from '../../service'

const TABS = Object.freeze([
  { key: 'leaderboard', label: 'Leaderboard Settings', Icon: SlidersHorizontal },
  { key: 'userThresholds', label: 'User Reputation & Threshold Settings', Icon: Users },
  { key: 'questionEscalation', label: 'Question Escalation Settings', Icon: Clock3 },
])

const LEADERBOARD_FIELDS = Object.freeze([
  { path: ['questionsAskedWeight'], label: 'Questions asked', step: '0.1' },
  { path: ['answersGivenWeight'], label: 'Answers given', step: '0.1' },
  { path: ['commentsGivenWeight'], label: 'Comments given', step: '0.1' },
  { path: ['acceptedResolutionsWeight'], label: 'Accepted resolutions', step: '0.1' },
  { path: ['upvotesReceivedWeight'], label: 'Upvotes/upholds received', step: '0.1' },
  { path: ['resolverActivityWeight'], label: 'Resolver activity', step: '0.1' },
  { path: ['sparkPointsWeight'], label: 'Spark points', step: '0.1' },
  { path: ['reputationWeight'], label: 'Reputation score', step: '0.1' },
  { path: ['warningPenaltyWeight'], label: 'Warning/negative penalty', step: '0.1' },
])

const RESOLVER_FIELDS = Object.freeze([
  { path: ['resolverEligibility', 'minAnswersOrComments'], label: 'Minimum comments/answers for resolver badge', integer: true },
  { path: ['resolverEligibility', 'minUpheldContributions'], label: 'Minimum upheld contributions', integer: true },
  { path: ['resolverEligibility', 'minSuccessfulResolverActions'], label: 'Minimum successful resolver actions', integer: true },
  { path: ['resolverEligibility', 'minAcceptedResolutions'], label: 'Minimum accepted resolutions', integer: true },
  { path: ['resolverEligibility', 'minReputationScore'], label: 'Minimum reputation score', integer: true },
  { path: ['resolverEligibility', 'minSparkPoints'], label: 'Minimum spark points', integer: true },
])

const MODERATION_FIELDS = Object.freeze([
  { path: ['moderationThresholds', 'warningsBeforeInactive'], label: 'Warnings before inactive', integer: true },
  { path: ['moderationThresholds', 'rejectedContentReviewThreshold'], label: 'Rejected/downheld/reported content review threshold', integer: true },
  { path: ['moderationThresholds', 'negativeFlagsBeforeAction'], label: 'Negative flags before action', integer: true },
  { path: ['moderationThresholds', 'inactivityDaysBeforeReview'], label: 'Inactivity days before review', integer: true },
])

const ESCALATION_FIELDS = Object.freeze([
  { path: ['unresolvedHoursToEscalate'], label: 'Hours before admin escalation', integer: true, min: 1 },
  { path: ['reminderHoursBeforeEscalation'], label: 'Reminder hours before escalation', integer: true },
])

const NUMERIC_FIELDS_BY_SECTION = Object.freeze({
  leaderboard: LEADERBOARD_FIELDS,
  userThresholds: [...RESOLVER_FIELDS, ...MODERATION_FIELDS],
  questionEscalation: ESCALATION_FIELDS,
})

const STRATEGY_OPTIONS = Object.freeze([
  { value: 'any_admin', label: 'Any active admin' },
  { value: 'round_robin_admin', label: 'Round-robin admin' },
  { value: 'default_admin', label: 'Default admin' },
])

const FORMULA_COMPONENTS = Object.freeze([
  { key: 'questionsAskedWeight',       label: 'Questions asked × weight' },
  { key: 'answersGivenWeight',         label: 'Answers given × weight' },
  { key: 'commentsGivenWeight',         label: 'Comments given × weight' },
  { key: 'acceptedResolutionsWeight',  label: 'Accepted resolutions × weight' },
  { key: 'upvotesReceivedWeight',      label: 'Upvotes/upholds received × weight' },
])

const state = Object.create(null);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [adminSettings, setAdminSettings] = useState(state);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await fetchAdminSettings();
        setAdminSettings(settings);
      } catch (error) {
        notifyError(error);
      }
    };
    fetchSettings();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSettingsChange = (section, field, value) => {
    const newSettings = { ...adminSettings };
    const sectionSettings = newSettings[section] || {};
    sectionSettings[field] = value;
    newSettings[section] = sectionSettings;
    setAdminSettings(newSettings);
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await updateAdminSettingsSection(adminSettings);
      notifySuccess('Settings saved successfully');
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="tabs">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => handleTabChange(tab.key)} className={activeTab === tab.key ? 'active' : ''}>
            <tab.Icon />
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'leaderboard' && (
        <div>
          <h2>Leaderboard Settings</h2>
          {LEADERBOARD_FIELDS.map((field) => (
            <Input
              key={field.path.join('.')}
              label={field.label}
              value={adminSettings.leaderboard[field.path.join('.')]}
              onChange={(value) => handleSettingsChange('leaderboard', field.path.join('.'), value)}
              step={field.step}
            />
          ))}
        </div>
      )}
      {activeTab === 'userThresholds' && (
        <div>
          <h2>User Reputation & Threshold Settings</h2>
          {NUMERIC_FIELDS_BY_SECTION.userThresholds.map((field) => (
            <Input
              key={field.path.join('.')}
              label={field.label}
              value={adminSettings.userThresholds[field.path.join('.')]}
              onChange={(value) => handleSettingsChange('userThresholds', field.path.join('.'), value)}
              type={field.integer ? 'integer' : 'number'}
            />
          ))}
        </div>
      )}
      {activeTab === 'questionEscalation' && (
        <div>
          <h2>Question Escalation Settings</h2>
          {ESCALATION_FIELDS.map((field) => (
            <Input
              key={field.path.join('.')}
              label={field.label}
              value={adminSettings.questionEscalation[field.path.join('.')]}
              onChange={(value) => handleSettingsChange('questionEscalation', field.path.join('.'), value)}
              type="integer"
              min={field.min}
            />
          ))}
        </div>
      )}
      <Button onClick={handleSaveSettings} disabled={loading}>
        {loading ? <Loader /> : <Save />}
        Save Settings
      </Button>
    </div>
  );
};

export default Settings;