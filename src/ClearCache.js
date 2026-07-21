import React, { useState, useEffect } from "react";
import packageJson from "../package.json";


const buildDateGreaterThan = (latestDate, currentDate) => {
  const momLatestDateTime = window.moment(latestDate);
  const momCurrentDateTime = window.moment(currentDate);

  if (momLatestDateTime.isAfter(momCurrentDateTime)) {
    return true;
  } else {
    return false;
  }
};

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(true);

    // useEffect(() => {
    //   fetch(`/meta.json?${new Date().getTime()}`, { cache: "no-cache" })
    //     .then((response) => response.json())
    //     .then((meta) => {
    //       const latestVersionDate = meta.buildDate;
    //       const currentVersionDate = packageJson.buildDate;

    //       const shouldForceRefresh = buildDateGreaterThan(latestVersionDate, currentVersionDate);
    //       if (shouldForceRefresh) {
    //         setIsLatestBuildDate(false);
    //         refreshCacheAndReload();
    //       } else {
    //         setIsLatestBuildDate(true);
    //       }
    //     });
    // }, []);

    const refreshCacheAndReload = async () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
      // delete browser cache and hard reload
      window.location.reload(true);
    };

    return <React.Fragment>{isLatestBuildDate ? <Component {...props} /> : null}</React.Fragment>;
  }

  return ClearCacheComponent;
}

export default withClearCache;
