import { Modal } from '../Modal.tsx';
import { useEffect, useState } from 'react';
import {
  deleteOpenAPIKey,
  getOpenAPIKey,
  saveOpenAPIKey,
} from '../../lib/jwt.ts';
import { cn } from '../../lib/classname.ts';
import { CloseIcon } from '../ReactIcons/CloseIcon.tsx';
import { useToast } from '../../hooks/use-toast.ts';

type OpenAISettingsProps = {
  onClose: () => void;
};

export function OpenAISettings(props: OpenAISettingsProps) {
  const { onClose } = props;

  const [defaultOpenAIKey, setDefaultOpenAIKey] = useState('');

  const [hasError, setHasError] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const toast = useToast();

  useEffect(() => {
    const apiKey = getOpenAPIKey();
    setOpenaiApiKey(apiKey || '');
    setDefaultOpenAIKey(apiKey || '');
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className="overflow-hidden rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-medium text-gray-800">OpenAI Settings</h2>
        <div className="mt-4">
          <p className="text-gray-700">
            AI Roadmap generator uses OpenAI's GPT-4 model to generate roadmaps.
          </p>

          <p className="mt-2">
            <a
              className="font-semibold underline underline-offset-2"
              href={'https://platform.openai.com/signup'}
              target="_blank"
            >
              Create an account on OpenAI
            </a>{' '}
            and enter your API key below to enable the AI Roadmap generator
          </p>

          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              setHasError(false);

              const normalizedKey = openaiApiKey.trim();
              if (!normalizedKey) {
                deleteOpenAPIKey();
                toast.success('OpenAI API key removed');
                onClose();
                return;
              }

              if (!normalizedKey.startsWith('sk-')) {
                setHasError(true);
                return;
              }

              // Save the API key to cookies
              saveOpenAPIKey(normalizedKey);
              toast.success('OpenAI API key saved');
              onClose();
            }}
          >
            <div className="relative">
              <input
                type="text"
                name="openai-api-key"
                id="openai-api-key"
                className={cn(
                  'block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 transition-colors focus:border-black focus:outline-none',
                  {
                    'border-red-500 bg-red-100 focus:border-red-500': hasError,
                  },
                )}
                placeholder="Enter your OpenAI API key"
                value={openaiApiKey}
                onChange={(e) => {
                  setHasError(false);
                  setOpenaiApiKey((e.target as HTMLInputElement).value);
                }}
              />

              {openaiApiKey && (
                <button
                  type={'button'}
                  onClick={() => {
                    setOpenaiApiKey('');
                  }}
                  className="absolute right-2 top-1/2 flex h-[20px] w-[20px] -translate-y-1/2 items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-600"
                >
                  <CloseIcon className="h-[13px] w-[13px] stroke-[3.5]" />
                </button>
              )}
            </div>
            {hasError && (
              <p className="mt-2 text-sm text-red-500">
                Please enter a valid OpenAI API key
              </p>
            )}
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-black"
            >
              Save
            </button>
            {defaultOpenAIKey && (
              <button
                type="button"
                onClick={() => {
                  deleteOpenAPIKey();
                  onClose();
                  toast.success('OpenAI API key removed');
                }}
                className="mt-1 w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-black hover:bg-red-700"
              >
                Reset to Default Key
              </button>
            )}
          </form>
        </div>
      </div>
    </Modal>
  );
}