

<?php
// dna.php
header('Content-Type: application/json');

// API URL الأصلي
$api_url = "https://v3.football.api-sports.io/"; 

// قراءة نوع الطلب والبيانات المرسلة
$type = isset($_GET['type']) ? $_GET['type'] : 'fixtures';
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
$league = isset($_GET['league']) ? $_GET['league'] : null;
$fixture_id = isset($_GET['fixture_id']) ? $_GET['fixture_id'] : null; // متغير لـ ID المباراة

// تم تثبيت الموسم على 2025
$season = isset($_GET['season']) ? $_GET['season'] : '2025'; 

$endpoint = '';
$params = [];
$api_key = '1cb3b9248ae458bb44e9fd5b84de537f'; // مفتاح API

if ($type === 'fixtures') {
    $endpoint = 'fixtures';
    $params = ['date' => $date];
} elseif ($type === 'match_details' && $fixture_id !== null) { // ****** الإضافة الجديدة: جلب تفاصيل المباراة ******
    // سنستخدم 3 طلبات للحصول على جميع التفاصيل المطلوبة
    $endpoints = [
        'statistics' => 'fixtures/statistics', // الإحصائيات (للتأكد من حالة المباراة)
        'events' => 'fixtures/events',         // الهدافون والتبديلات والبطاقات
        'lineups' => 'fixtures/lineups'        // التشكيلات والمدربين
    ];
    
    $results = [];

    foreach ($endpoints as $key => $sub_endpoint) {
        $ch = curl_init();
        $url = $api_url . $sub_endpoint . '?' . http_build_query(['fixture' => $fixture_id]);

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['x-apisports-key: ' . $api_key]);

        $response = curl_exec($ch);
        if(curl_errno($ch)){
            // نواصل إذا كان هناك خطأ في طلب واحد، ولكن نرسل خطأ إذا كان الأمر حاسماً
             $results[$key] = ['error' => 'cURL Error: ' . curl_error($ch)];
             continue;
        }
        $results[$key] = json_decode($response, true);
        curl_close($ch);
    }
    
    // إرجاع جميع النتائج مجمعة
    echo json_encode(['response' => $results]);
    exit;

} else {
    // خطأ في الطلب
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request type or missing parameters']);
    exit;
}

// طلب المباريات اليومي (القديم)
$ch = curl_init();
$url = $api_url . $endpoint . '?' . http_build_query($params);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'x-apisports-key: ' . $api_key, 
]);

$response = curl_exec($ch);
if(curl_errno($ch)){
    // خطأ في cURL
    http_response_code(500);
    echo json_encode(['error' => curl_error($ch)]);
    exit;
}
curl_close($ch);

// إعادة الاستجابة للـ JS
echo $response;
?>