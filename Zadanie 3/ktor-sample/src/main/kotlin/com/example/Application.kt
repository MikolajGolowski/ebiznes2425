package com.example

// src/main/kotlin/com/example/Application.kt
import com.example.plugins.configureRouting
import io.ktor.server.application.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.client.plugins.kotlinx.serializer.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.*
import io.netty.handler.logging.LogLevel
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import net.dv8tion.jda.api.JDABuilder
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.hooks.ListenerAdapter
import net.dv8tion.jda.api.requests.GatewayIntent
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.*

fun main() {
    // Start Ktor server
    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }

        routing {
            post("/send") {
                val message = call.receive<MessageRequest>()
                val response = sendMessageToDiscord(message.content)
                call.respondText(response, status = HttpStatusCode.OK)
            }
        }
    }.start(wait = false)

    // Start JDA bot
    val jda = JDABuilder.createDefault("<token>")
        .addEventListeners(MessageListener())
        .enableIntents(GatewayIntent.MESSAGE_CONTENT)
        .build()
    jda.awaitReady()
}

@Serializable
data class MessageRequest(
    @SerialName("content")
    val content: String)

@OptIn(InternalAPI::class)
suspend fun sendMessageToDiscord(content: String): String {
    val client = HttpClient()

    val _body = "{\"content\": \"$content\"}"

    val response: HttpResponse = client.post("https://discord.com/api/v10/channels/<channel>/messages") {
        header("Authorization", "Bot <token>")
        contentType(ContentType.Text.Plain)
        body = _body
    }

    val ret = response.content.readUTF8Line() ?: return ""
    return ret
}

class MessageListener : ListenerAdapter() {
    override fun onMessageReceived(event: MessageReceivedEvent) {
        if (event.author.isBot) return

        if (event.message.contentRaw.startsWith("!bot")) {
            val response = "${event.author.name}: ${event.message.contentRaw}"
            event.channel.sendMessage(response).queue()
        }
    }
}


fun Application.module() {
    configureRouting()
}
