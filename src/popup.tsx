import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Tab {
  id: number;
  title: string;
  url: string;
  createdAt: number;
}

function App() {
  const [tabs, setTabs] = useState<Array<Tab>>([]);

  useEffect(() => {
    const updateTabs = () => {
      chrome.storage.local.get(null, (items) => {
        setTabs((currentTabs) => {
          const newTabs = Object.entries(items).map(
            ([_id, info]) => info as Tab
          );
          return [...currentTabs, ...newTabs];
        });
      });
    };
    updateTabs();

    chrome.storage.onChanged.addListener(updateTabs);

    return () => {
      chrome.storage.onChanged.removeListener(updateTabs);
    };
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true, locale: ko });
  };

  const fetchTabs = () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.storage.local.get([tab.id?.toString()], (items) => {
          if (tab.id && !items[tab.id]) {
            const newTab = {
              id: tab.id,
              title: tab.title,
              url: tab.url,
              createdAt: Date.now(),
            };
            chrome.storage.local.set({ [tab.id as number]: newTab });
          }
        });
      });
    });
  };

  return (
    <>
      <button onClick={fetchTabs}>Reload</button>
      <ul className="p-2">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <p>{tab.title}</p>
            <p>{formatTimeAgo(tab.createdAt)}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
