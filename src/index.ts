import axios from "axios";

export interface AntiCaptchaPayload {
  [index: string]: string | boolean | number;
}

export let settings: any = {
  clientKey: "12345678901234567890123456789012",

  // reCAPTCHA 2
  websiteSToken: null,
  recaptchaDataSValue: null,

  // image
  phrase: null,
  case: null,
  numeric: null,
  math: null,
  minLength: null,
  maxLength: null,
  languagePool: null,
  comment: null,
  cookies: undefined,

  connectionTimeout: 20,
  firstAttemptWaitingInterval: 5,
  normalWaitingInterval: 2,
  isVerbose: true,
  taskId: 0,

  funcaptchaApiJSSubdomain: null,
  funcaptchaDataBlob: null,
};

export function setAPIKey(key: string) {
  settings.clientKey = key;
}

export function shutUp() {
  settings.isVerbose = false;
}

export async function getBalance() {
  const res = await JSONRequest("getBalance", {
    clientKey: settings.clientKey,
  });
  return res.balance;
}

export async function solveImage(body: any) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "ImageToTextTask",
      body: body,
      phrase: settings.phrase,
      case: settings.case,
      numeric: settings.numeric,
      comment: settings.comment,
      math: settings.math,
      minLength: settings.minLength,
      maxLength: settings.maxLength,
    },
    languagePool: settings.languagePool,
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  return solution.text;
}

export function reportIncorrectImageCaptcha() {
  return JSONRequest("reportIncorrectImageCaptcha", {
    clientKey: settings.clientKey,
    taskId: settings.taskId,
  });
}

export async function solveRecaptchaV2Proxyless(
  websiteURL: string,
  websiteKey: string
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "RecaptchaV2TaskProxyless",
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      websiteSToken: settings.websiteSToken,
      recaptchaDataSValue: settings.recaptchaDataSValue,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  if (solution.cookies) {
    settings.cookies = solution.cookies;
  }
  return solution.gRecaptchaResponse;
}

export async function solveRecaptchaV2ProxyOn(
  websiteURL: string,
  websiteKey: string,
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
  userAgent: string,
  cookies: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "RecaptchaV2Task",
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      websiteSToken: settings.websiteSToken,
      recaptchaDataSValue: settings.recaptchaDataSValue,
      proxyType: proxyType,
      proxyAddress: proxyAddress,
      proxyPort: proxyPort,
      proxyLogin: proxyLogin,
      proxyPassword: proxyPassword,
      userAgent: userAgent,
      cookies: cookies,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  if (solution.cookies) {
    settings.cookies = solution.cookies;
  }
  return solution.gRecaptchaResponse;
}

export async function solveRecaptchaV3(
  websiteURL: string,
  websiteKey: string,
  minScore: number,
  pageAction: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "RecaptchaV3TaskProxyless",
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      minScore: minScore,
      pageAction: pageAction,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  return solution.gRecaptchaResponse;
}

export async function solveRecaptchaV2EnterpriseProxyless(
  websiteURL: string,
  websiteKey: string,
  enterprisePayload: AntiCaptchaPayload | null = null
) {
  let taskObject: any = {
    type: "RecaptchaV2EnterpriseTaskProxyless",
    websiteURL: websiteURL,
    websiteKey: websiteKey,
  };
  if (enterprisePayload) {
    taskObject["enterprisePayload"] = enterprisePayload;
  }
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: taskObject,
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  return solution.gRecaptchaResponse;
}

export async function solveRecaptchaV2EnterpriseProxyOn(
  websiteURL: string,
  websiteKey: string,
  enterprisePayload: AntiCaptchaPayload,
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
  userAgent: string,
  cookies: any
) {
  let taskObject: any = {
    type: "RecaptchaV2EnterpriseTaskProxyless",
    websiteURL: websiteURL,
    websiteKey: websiteKey,
    proxyType: proxyType,
    proxyAddress: proxyAddress,
    proxyPort: proxyPort,
    proxyLogin: proxyLogin,
    proxyPassword: proxyPassword,
    userAgent: userAgent,
    cookies: cookies,
  };
  if (enterprisePayload) {
    taskObject["enterprisePayload"] = enterprisePayload;
  }
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: taskObject,
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);

  return solution.gRecaptchaResponse;
}

export async function solveRecaptchaV3Enterprise(
  websiteURL: string,
  websiteKey: string,
  minScore: number,
  pageAction: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "RecaptchaV3TaskProxyless",
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      minScore: minScore,
      pageAction: pageAction,
      isEnterprise: true,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  return solution.gRecaptchaResponse;
}

export function reportIncorrectRecaptcha() {
  return JSONRequest("reportIncorrectRecaptcha", {
    clientKey: settings.clientKey,
    taskId: settings.taskId,
  });
}

export function reportCorrectRecaptcha() {
  return JSONRequest("reportCorrectRecaptcha", {
    clientKey: settings.clientKey,
    taskId: settings.taskId,
  });
}

export async function solveHCaptchaProxyless(
  websiteURL: string,
  websiteKey: string
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "HCaptchaTaskProxyless",
      websiteURL: websiteURL,
      websiteKey: websiteKey,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  return solution.gRecaptchaResponse;
}

export async function solveHCaptchaProxyOn(
  websiteURL: string,
  websiteKey: string,
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
  userAgent: string,
  cookies: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "HCaptchaTask",
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      proxyType: proxyType,
      proxyAddress: proxyAddress,
      proxyPort: proxyPort,
      proxyLogin: proxyLogin,
      proxyPassword: proxyPassword,
      userAgent: userAgent,
      cookies: cookies,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  if (solution.cookies) {
    settings.cookies = solution.cookies;
  }

  return solution.gRecaptchaResponse;
}

export async function solveFunCaptchaProxyless(
  websiteURL: string,
  websiteKey: string
) {
  const params = {
    clientKey: settings.clientKey,
    task: {
      type: "FunCaptchaTaskProxyless",
      websiteURL: websiteURL,
      websitePublicKey: websiteKey,
      funcaptchaApiJSSubdomain: settings.funcaptchaApiJSSubdomain
        ? settings.funcaptchaApiJSSubdomain
        : "",
      data: settings.funcaptchaDataBlob
        ? JSON.stringify({
            blob: settings.funcaptchaDataBlob,
          })
        : "",
    },
  };
  const res = await JSONRequest("createTask", params);
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);

  return solution.token;
}

export async function solveFunCaptchaProxyOn(
  websiteURL: string,
  websiteKey: string,
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
  userAgent: string,
  cookies: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "FunCaptchaTask",
      websiteURL: websiteURL,
      websitePublicKey: websiteKey,
      funcaptchaApiJSSubdomain: settings.funcaptchaApiJSSubdomain,
      proxyType: proxyType,
      proxyAddress: proxyAddress,
      proxyPort: proxyPort,
      proxyLogin: proxyLogin,
      proxyPassword: proxyPassword,
      userAgent: userAgent,
      cookies: cookies,
    },
  });
  settings.taskId = res.taskId;
  const solution = await waitForResult(res.taskId);
  if (solution.cookies) {
    settings.cookies = solution.cookies;
  }

  return solution.token;
}

export async function solveGeeTestProxyless(
  websiteURL: string,
  gt: any,
  challenge: any,
  apiSubdomain: any,
  getLib: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "GeeTestTaskProxyless",
      websiteURL: websiteURL,
      gt: gt,
      challenge: challenge,
      geetestApiServerSubdomain: apiSubdomain,
      geetestGetLib: getLib,
    },
  });
  settings.taskId = res.taskId;

  return waitForResult(res.taskId);
}

export async function solveGeeTestProxyOn(
  websiteURL: string,
  gt: any,
  challenge: any,
  apiSubdomain: string,
  getLib: any,
  proxyType: string,
  proxyAddress: string,
  proxyPort: number,
  proxyLogin: string,
  proxyPassword: string,
  userAgent: string,
  cookies: any
) {
  const res = await JSONRequest("createTask", {
    clientKey: settings.clientKey,
    task: {
      type: "GeeTestTask",
      websiteURL: websiteURL,
      gt: gt,
      challenge: challenge,
      geetestApiServerSubdomain: apiSubdomain,
      geetestGetLib: getLib,

      proxyType: proxyType,
      proxyAddress: proxyAddress,
      proxyPort: proxyPort,
      proxyLogin: proxyLogin,
      proxyPassword: proxyPassword,
      userAgent: userAgent,
      cookies: cookies,
    },
  });
  settings.taskId = res.taskId;

  const solution = await waitForResult(res.taskId);
  if (solution.cookies) {
    settings.cookies = solution.cookies;
  }
  return solution;
}

export async function waitForResult(taskId: number) {
  if (settings.isVerbose) {
    console.log("created task with ID " + taskId);
    console.log("waiting " + settings.firstAttemptWaitingInterval + " seconds");
  }
  await delay(settings.firstAttemptWaitingInterval * 1000);

  while (taskId > 0) {
    try {
      const response = await JSONRequest("getTaskResult", {
        clientKey: settings.clientKey,
        taskId: taskId,
      });
      if (response.status === "ready") {
        taskId = 0;
        return response.solution;
      }
      if (response.status === "processing") {
        if (settings.isVerbose) console.log("captcha result is not yet ready");
      }
    } catch (err) {
      taskId = 0;
      throw new Error(err);
    }

    if (settings.isVerbose)
      console.log("waiting " + settings.normalWaitingInterval + " seconds");
    await delay(settings.normalWaitingInterval * 1000);
  }
}
export async function JSONRequest(methodName: string, data: any) {
  const res = await axios.post(
    `https://api.anti-captcha.com/${methodName}`,
    data,
    {
      timeout: settings.connectionTimeout * 1000,
      headers: {
        "content-type": "application/json; charset=utf-8",
        accept: "application/json",
      },
    }
  );
  return checkForErrors(res.data);
}

export async function checkForErrors(response: any) {
  if (typeof response.errorId === "undefined") {
    throw new Error("Incorrect API response, something is wrong");
  } else if (typeof response.errorId !== "number") {
    throw new Error("Unknown API error code " + response.errorId);
  } else if (response.errorId > 0) {
    console.error(
      "Received API error " +
        response.errorCode +
        ": " +
        response.errorDescription
    );
    throw new Error(response.errorCode);
  }
  return response;
}

export function getCookies() {
  return settings.cookies;
}

export function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export default {
  settings,
  setAPIKey,
  shutUp,
  getBalance,
  solveImage,
  reportIncorrectImageCaptcha,
  solveRecaptchaV2Proxyless,
  solveRecaptchaV2ProxyOn,
  solveRecaptchaV3,
  solveRecaptchaV2EnterpriseProxyless,
  solveRecaptchaV2EnterpriseProxyOn,
  solveRecaptchaV3Enterprise,
  reportIncorrectRecaptcha,
  reportCorrectRecaptcha,
  solveHCaptchaProxyless,
  solveHCaptchaProxyOn,
  solveFunCaptchaProxyless,
  solveFunCaptchaProxyOn,
  solveGeeTestProxyless,
  solveGeeTestProxyOn,
  waitForResult,
  JSONRequest,
  checkForErrors,
  getCookies,
  delay,
};
