class HttpService {
  ajax(method, url, data, headers) {
    const fetchHeaders = new Headers({
      "content-type": "application/json",
      ...(headers || {}),
      //wie weiter?
    });
  }
}

export const httpService = new HttpService();
