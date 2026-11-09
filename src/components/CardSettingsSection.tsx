'use client';

import type { ReactNode } from 'react';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, SpinButton, type SpinButtonProps } from '@fluentui/react-components';
import { Layers, SlidersHorizontal } from 'lucide-react';
import {
  CardSettingsData, DifficultySettingsData, calculateDaysToForget, REVISION_RATINGS,
} from '../types/cardSettings';

interface CardSettingsSectionProps {
  cardSettings: CardSettingsData;
  difficultySettings: DifficultySettingsData;
  onUpdateCardSettings: (newSettings: CardSettingsData) => void;
  onUpdateDifficultySettings: (newSettings: DifficultySettingsData) => void;
  onResetCardSettings: () => void;
  onResetDifficultySettings: () => void;
}

function NumberBox({ onValue, ...props }: Omit<SpinButtonProps, 'onChange'> & { onValue: (value: number) => void }) {
  return (
    <SpinButton
      step={0.1}
      {...props}
      onChange={(_, data) => {
        const value = data.value ?? Number(data.displayValue);
        if (Number.isFinite(value)) onValue(value);
      }}
    />
  );
}

export function DurationInput({ minutes, label, onChange }: {
  minutes: number;
  label: string;
  onChange: (minutes: number) => void;
}) {
  const units = [
    { name: 'Days', size: 1440, limit: 365, value: Math.floor(minutes / 1440) },
    { name: 'Hours', size: 60, limit: 23, value: Math.floor(minutes / 60) % 24 },
    { name: 'Minutes', size: 1, limit: 59, value: minutes % 60 },
  ];
  return (
    <div role="group" aria-label={label} className="winui-duration-input">
      {units.map(({ name, size, limit, value }) => (
        <div key={name}>
          <span>{name}</span>
          <NumberBox
            aria-label={name}
            value={value}
            min={0}
            max={limit}
            step={1}
            onValue={(next) => {
              const clamped = Math.max(0, Math.min(limit, Math.round(next)));
              onChange(minutes + (clamped - value) * size);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function SettingsRow({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="winui-expander-row">
      <div>
        <div>{title}</div>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function CardSettingsSection({
  cardSettings, difficultySettings, onUpdateCardSettings, onUpdateDifficultySettings,
  onResetCardSettings, onResetDifficultySettings,
}: CardSettingsSectionProps) {
  const { minimumWeight, maximumWeight, defaultWeight, decayWeight, decayDurationHours } = cardSettings;
  const daysToForget = calculateDaysToForget(minimumWeight, maximumWeight, decayWeight, decayDurationHours);

  return (
    <Accordion multiple collapsible defaultOpenItems={['difficulty', 'card']} className="winui-settings-expanders">
      <AccordionItem value="difficulty">
        <AccordionHeader icon={<SlidersHorizontal size={20} strokeWidth={1.5} />} expandIconPosition="end">
          <div>Difficulty weights<p>A higher card weight increases its chance of reappearing.</p></div>
        </AccordionHeader>
        <AccordionPanel>
          <div className="winui-expander-reset"><Button onClick={onResetDifficultySettings}>Reset to default</Button></div>
          {REVISION_RATINGS.map(({ name, weight, delay }) => (
            <SettingsRow key={name} title={name}>
              <div className="winui-rating-settings">
                <div>
                  <span>Weight</span>
                  <NumberBox
                    aria-label={`${name} weight`}
                    value={difficultySettings[weight]}
                    onValue={(value) => onUpdateDifficultySettings({ ...difficultySettings, [weight]: value })}
                  />
                </div>
                <div>
                  <span>Hide card for</span>
                  <DurationInput
                    label={`${name} delay`}
                    minutes={difficultySettings[delay]}
                    onChange={(minutes) => onUpdateDifficultySettings({ ...difficultySettings, [delay]: minutes })}
                  />
                </div>
              </div>
            </SettingsRow>
          ))}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="card">
        <AccordionHeader icon={<Layers size={20} strokeWidth={1.5} />} expandIconPosition="end">
          <div>Card settings<p>Set the starting weight, limits, and decay for cards.</p></div>
        </AccordionHeader>
        <AccordionPanel>
          <div className="winui-expander-reset"><Button onClick={onResetCardSettings}>Reset to default</Button></div>
          <SettingsRow title="Default card weight for new cards" description="Pick a high value that is below the maximum.">
            <NumberBox aria-label="Default card weight for new cards" value={defaultWeight} min={minimumWeight} max={maximumWeight}
              onValue={(value) => onUpdateCardSettings({
                ...cardSettings, defaultWeight: Math.min(maximumWeight, Math.max(minimumWeight, value)),
              })} />
          </SettingsRow>
          <SettingsRow title="Minimum card weight for new cards" description="Pick a value above 0.">
            <NumberBox aria-label="Minimum card weight for new cards" value={minimumWeight} min={0.1} max={maximumWeight}
              onValue={(value) => {
                const minimum = Math.max(0.1, Math.min(maximumWeight, value));
                onUpdateCardSettings({ ...cardSettings, minimumWeight: minimum, defaultWeight: Math.max(minimum, defaultWeight) });
              }} />
          </SettingsRow>
          <SettingsRow title="Maximum card weight for new cards">
            <NumberBox aria-label="Maximum card weight for new cards" value={maximumWeight} min={minimumWeight}
              onValue={(value) => {
                const maximum = Math.max(minimumWeight, value);
                onUpdateCardSettings({
                  ...cardSettings, maximumWeight: maximum,
                  defaultWeight: Math.min(maximum, defaultWeight), decayWeight: Math.min(maximum, decayWeight),
                });
              }} />
          </SettingsRow>
          <SettingsRow title="Card weight decay amount" description="How much each card’s weight increases after every decay interval.">
            <NumberBox aria-label="Card weight decay amount" value={decayWeight} min={0} max={maximumWeight}
              onValue={(value) => onUpdateCardSettings({
                ...cardSettings, decayWeight: Math.min(maximumWeight, Math.max(0, value)), lastDecayTime: null,
              })} />
          </SettingsRow>
          <SettingsRow title="Card weight decay interval" description={daysToForget === null
            ? 'Decay has been disabled.' : `It will take ${daysToForget} days to forget a memorized card.`}>
            <DurationInput label="Card weight decay interval" minutes={Math.round((decayDurationHours ?? 0) * 60)}
              onChange={(minutes) => onUpdateCardSettings({
                ...cardSettings, decayDurationHours: minutes ? minutes / 60 : null, lastDecayTime: null,
              })} />
          </SettingsRow>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
