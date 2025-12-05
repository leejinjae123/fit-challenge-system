from flask import Flask, jsonify, request
from kafka import KafkaConsumer, KafkaProducer
import json
import os
import threading

app = Flask(__name__)

# Configuration
KAFKA_BOOTSTRAP_SERVERS = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')

# Kafka Producer (to send analysis results)
producer = None
try:
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
except Exception as e:
    print(f"Warning: Kafka Producer not connected: {e}")

@app.route('/ai/health', methods=['GET'])
def health():
    return jsonify({"status": "up", "service": "ai-service"})

@app.route('/ai/analyze', methods=['POST'])
def analyze_frame():
    # Mock endpoint to receive a frame or data and return posture
    # In reality, this would process image data
    data = request.json
    result = {"posture": "correct", "confidence": 0.95}
    
    # Send to Kafka if needed
    if producer:
        producer.send('challenge-events', {'type': 'POSTURE_CHECK', 'data': result})
        
    return jsonify(result)

def start_kafka_consumer():
    # Example Consumer: Listen for start-challenge events
    try:
        consumer = KafkaConsumer(
            'challenge-events',
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            group_id='ai-group'
        )
        print("Kafka Consumer started")
        for message in consumer:
            print(f"Received: {message.value}")
    except Exception as e:
        print(f"Warning: Kafka Consumer failed: {e}")

if __name__ == '__main__':
    # Start Kafka consumer in background
    t = threading.Thread(target=start_kafka_consumer)
    t.daemon = True
    t.start()
    
    app.run(host='0.0.0.0', port=5000)

