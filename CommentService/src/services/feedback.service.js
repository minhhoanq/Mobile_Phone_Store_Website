const feedbackRepo = require("../repositories/feedback.repo");
const imageFeedbackRepo = require("../repositories/imageFeedback.repo");
const { RPCRequest } = require("../utils/rabbitmq");
require("dotenv").config();

class FeedbackService {
    //connection socket
    connection(socket) {
        console.log("User connection with id: ", socket.id);

        socket.on("disconnect", () => {
            console.log(`User disconnect id is ${socket.id}`);
        });

        // event on here

        socket.on("joinRoom", (msg) => {
            socket.room = msg;
            console.log(`msg is:::${msg}`);
            socket.join(msg);
            console.log(socket.adapter.rooms);
        });

        socket.on("userComment", (data) => {
            console.log(data);
            _io.sockets.in(socket.room).emit("serverComment", data);
        });
        // on room..
    }

    async createFeedback(body) {
        // const producer = await getProducer();
        const response = await RPCRequest(process.env.FEEDBACK_MAIN_RPC, body);
        const data = {
            userId: response.user.id,
            orderItemId: response.orderItemId,
            star: +body.data.star,
            content: body.data.content,
        };
        const createFeedback = await feedbackRepo.createFeedback(data);

        const createImageFeedback = body.data.images.map(async (image) => {
            await imageFeedbackRepo.createImageFeedback({
                feedbackId: createFeedback.id,
                src: image,
            });
        });

        await Promise.all(createImageFeedback);

        if (createFeedback) {
            return {
                user: response.user,
                orderItemId: response.orderItemId,
                star: +body.data.star,
                content: body.data.content,
                imageFeedbacks: body.data.images.map((image) => ({
                    src: image,
                })),
                createdAt: createFeedback.createdAt,
            };
        }
        return null;
    }

    async getFeedbackItem(data) {
        const feedback = await feedbackRepo.getFeedbacks(data);
        return feedback;
    }

    async SubscribeEvents(payload) {
        const { event, data } = payload;

        switch (event) {
            case "GET_FEEDBACK_ITEM":
                return await this.getFeedbackItem(data);

            default:
                return null;
        }
    }
}

module.exports = new FeedbackService();
