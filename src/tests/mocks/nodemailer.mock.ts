const sendMail = jest.fn().mockResolvedValue({});
const verify = jest.fn().mockResolvedValue(true);
const createTransport = jest.fn().mockReturnValue({ verify, sendMail });

export default { createTransport };
export { createTransport };
