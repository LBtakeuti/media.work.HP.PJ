-- 既存のニュース記事とタグを紐付ける
-- categoryの値に基づいてnews_tagsからタグを探し、news_tag_relationsに紐付けを作成

INSERT INTO news_tag_relations (news_id, tag_id)
SELECT 
  n.id as news_id,
  nt.id as tag_id
FROM news n
INNER JOIN news_tags nt ON n.category = nt.name
WHERE NOT EXISTS (
  SELECT 1 
  FROM news_tag_relations ntr 
  WHERE ntr.news_id = n.id AND ntr.tag_id = nt.id
);
